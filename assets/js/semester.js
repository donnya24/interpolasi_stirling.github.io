/**
 * Kode untuk fitur interpolasi nilai semester
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables for semester tab
  window.semesterLatestResult = "";
  window.semesterChartData = null;

  // Setup event listeners for semester tab
  document
    .getElementById("semesterCsvFile")
    .addEventListener("change", handleSemesterCSV);
  document
    .getElementById("hitungSemesterBtn")
    .addEventListener("click", hitungSemesterStirling);
  document
    .getElementById("hitungSemesterBaruBtn")
    .addEventListener("click", resetSemesterForm);
  document
    .getElementById("unduhSemesterHasilBtn")
    .addEventListener("click", downloadSemesterHasil);
  document
    .getElementById("unduhSemesterGrafikBtn")
    .addEventListener("click", downloadSemesterGrafik);
});

function hitungSemesterStirling() {
  // Reset error state
  document.getElementById("semesterHasilOutput").classList.remove("error");

  const inputText = document.getElementById("semesterDataInput").value;
  const xInput = parseFloat(document.getElementById("semesterXInput").value);

  if (!inputText || isNaN(xInput)) {
    document.getElementById("semesterHasilOutput").innerText =
      "Harap masukkan data dan nilai X yang valid";
    document.getElementById("semesterHasilOutput").classList.add("error");
    return;
  }

  const data = parseData(inputText);
  if (!data) {
    document.getElementById("semesterHasilOutput").innerText =
      "Format data tidak valid";
    document.getElementById("semesterHasilOutput").classList.add("error");
    return;
  }

  const n = data.length;

  if (n < 5 || n % 2 === 0) {
    document.getElementById("semesterHasilOutput").innerText =
      "Jumlah data harus ganjil dan minimal 5.";
    document.getElementById("semesterHasilOutput").classList.add("error");
    return;
  }

  // Sort data berdasarkan x
  data.sort((a, b) => a.x - b.x);

  // Hitung selisih interval h
  const h = data[1].x - data[0].x;

  // Validasi interval seragam
  for (let i = 1; i < data.length; i++) {
    if (Math.abs(data[i].x - data[i - 1].x - h) > 0.0001) {
      document.getElementById("semesterHasilOutput").innerText =
        "Interval data X harus seragam";
      document.getElementById("semesterHasilOutput").classList.add("error");
      return;
    }
  }

  const mid = Math.floor(n / 2);
  const u = (xInput - data[mid].x) / h;

  // Membuat tabel selisih
  const diffTable = Array(n)
    .fill()
    .map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    diffTable[i][0] = data[i].y;
  }

  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      diffTable[i][j] = diffTable[i + 1][j - 1] - diffTable[i][j - 1];
    }
  }

  // Proses interpolasi Stirling
  let hasil = diffTable[mid][0];
  let fact = 1;
  let uTerm = 1;
  let k = 1;

  for (let i = 1; i < n; i++) {
    fact *= i;

    if (i % 2 === 1) {
      uTerm *= (u - (k - 1)) * (u + (k - 1));
      hasil +=
        (uTerm / fact) *
        ((diffTable[mid - k + 1][i] + diffTable[mid - k][i]) / 2);
      k++;
    } else {
      uTerm *= u - (k - 1);
      hasil += (uTerm / fact) * diffTable[mid - (k - 1)][i];
    }
  }

  // Format hasil
  const timestamp = new Date().toLocaleString();
  window.semesterLatestResult = `Hasil interpolasi nilai IPK pada semester ${xInput} adalah: ${hasil.toFixed(
    2
  )}\n\nData yang digunakan:\n${data
    .map((d) => `Semester: ${d.x}, IPK: ${d.y.toFixed(2)}`)
    .join("\n")}`;

  // Tampilkan hasil
  document.getElementById("semesterHasilOutput").innerText =
    window.semesterLatestResult;
  document.getElementById("unduhSemesterHasilBtn").disabled = false;
  document.getElementById("unduhSemesterGrafikBtn").disabled = false;
  document.getElementById("hitungSemesterBaruBtn").style.display =
    "inline-block";

  // Simpan data untuk chart
  window.semesterChartData = {
    dataPoints: data,
    interpolatedPoint: { x: xInput, y: hasil },
  };

  // Simpan ke history
  const historyItem = {
    timestamp: timestamp,
    xValue: xInput,
    result: hasil.toFixed(2),
    dataPoints: data,
    calculation: window.semesterLatestResult,
    type: "semester",
  };

  // Save to history
  if (window.history && window.history.saveToHistory) {
    window.history.saveToHistory(historyItem);
    window.history.renderHistory();
  }

  // Render chart
  renderSemesterChart();
}

function renderSemesterChart() {
  if (!window.semesterChartData) return;

  const ctx = document.getElementById("semesterChartCanvas").getContext("2d");
  if (window.semesterChart) window.semesterChart.destroy();

  window.semesterChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Data IPK",
          data: window.semesterChartData.dataPoints.map((d) => ({
            x: d.x,
            y: d.y,
          })),
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.7)",
          showLine: true,
          tension: 0.3,
          pointStyle: "circle",
          pointRadius: 6,
          borderWidth: 1,
        },
        {
          label: `Titik Interpolasi (X = ${window.semesterChartData.interpolatedPoint.x.toFixed(
            2
          )})`,
          data: [window.semesterChartData.interpolatedPoint],
          backgroundColor: "rgba(255, 99, 132, 0.8)",
          borderColor: "rgba(255, 99, 132, 1)",
          pointStyle: "triangle",
          pointRadius: 8,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `Semester: ${context.parsed.x.toFixed(
                0
              )}, IPK: ${context.parsed.y.toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Semester (X)",
            font: {
              weight: "bold",
            },
          },
          grid: {
            display: true,
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Nilai IPK",
            font: {
              weight: "bold",
            },
          },
          grid: {
            display: true,
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
      },
      elements: {
        line: {
          borderWidth: 2,
          fill: false,
        },
      },
    },
  });
}

function handleSemesterCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result.trim();
    const lines = text.split("\n");
    const dataLines = lines
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.length > 0 &&
          !line.toLowerCase().includes("x") &&
          line.includes(",")
      );

    document.getElementById("semesterDataInput").value = dataLines.join("\n");
  };
  reader.readAsText(file);
}

function resetSemesterForm() {
  document.getElementById("semesterDataInput").value = "";
  document.getElementById("semesterCsvFile").value = "";
  document.getElementById("semesterXInput").value = "";
  document.getElementById("semesterHasilOutput").innerText =
    "Hasil akan ditampilkan di sini...";
  document.getElementById("semesterHasilOutput").classList.remove("error");
  document.getElementById("unduhSemesterHasilBtn").disabled = true;
  document.getElementById("unduhSemesterGrafikBtn").disabled = true;
  document.getElementById("hitungSemesterBaruBtn").style.display = "none";

  if (window.semesterChart) {
    window.semesterChart.destroy();
    window.semesterChart = null;
  }
}

function downloadSemesterHasil() {
  if (!window.semesterLatestResult) {
    alert("Belum ada hasil untuk diunduh.");
    return;
  }

  const blob = new Blob([window.semesterLatestResult], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hasil_interpolasi_semester.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadSemesterGrafik() {
  if (!window.semesterChart) {
    alert("Belum ada grafik untuk diunduh.");
    return;
  }

  const imageLink = document.createElement("a");
  imageLink.download = "grafik_interpolasi_semester.png";
  imageLink.href = window.semesterChart.canvas.toDataURL("image/png");
  imageLink.click();
}

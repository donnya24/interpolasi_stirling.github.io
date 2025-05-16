/**
 * Kode untuk fitur interpolasi nilai dolar
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables for dolar tab
  window.dolarLatestResult = "";
  window.dolarChartData = null;

  // Setup event listeners for dolar tab
  document
    .getElementById("dolarCsvFile")
    .addEventListener("change", handleDolarCSV);
  document
    .getElementById("hitungDolarBtn")
    .addEventListener("click", hitungDolarStirling);
  document
    .getElementById("hitungDolarBaruBtn")
    .addEventListener("click", resetDolarForm);
  document
    .getElementById("unduhDolarHasilBtn")
    .addEventListener("click", downloadDolarHasil);
  document
    .getElementById("unduhDolarGrafikBtn")
    .addEventListener("click", downloadDolarGrafik);
});

function hitungDolarStirling() {
  // Reset error state
  document.getElementById("dolarHasilOutput").classList.remove("error");

  const inputText = document.getElementById("dolarDataInput").value;
  const xInput = parseFloat(document.getElementById("dolarXInput").value);

  if (!inputText || isNaN(xInput)) {
    document.getElementById("dolarHasilOutput").innerText =
      "Harap masukkan data dan nilai X yang valid";
    document.getElementById("dolarHasilOutput").classList.add("error");
    return;
  }

  const data = parseData(inputText);
  if (!data) {
    document.getElementById("dolarHasilOutput").innerText =
      "Format data tidak valid";
    document.getElementById("dolarHasilOutput").classList.add("error");
    return;
  }

  const n = data.length;

  if (n < 5 || n % 2 === 0) {
    document.getElementById("dolarHasilOutput").innerText =
      "Jumlah data harus ganjil dan minimal 5.";
    document.getElementById("dolarHasilOutput").classList.add("error");
    return;
  }

  // Sort data berdasarkan x
  data.sort((a, b) => a.x - b.x);

  // Hitung selisih interval h
  const h = data[1].x - data[0].x;

  // Validasi interval seragam
  for (let i = 1; i < data.length; i++) {
    if (Math.abs(data[i].x - data[i - 1].x - h) > 0.0001) {
      document.getElementById("dolarHasilOutput").innerText =
        "Interval data X harus seragam";
      document.getElementById("dolarHasilOutput").classList.add("error");
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
  window.dolarLatestResult = `Hasil interpolasi nilai dolar pada X = ${xInput} adalah: ${hasil.toFixed(
    2
  )} IDR\n\nData yang digunakan:\n${data
    .map((d) => `Hari: ${d.x}, Nilai: Rp ${d.y.toFixed(2)}`)
    .join("\n")}`;

  // Tampilkan hasil
  document.getElementById("dolarHasilOutput").innerText =
    window.dolarLatestResult;
  document.getElementById("unduhDolarHasilBtn").disabled = false;
  document.getElementById("unduhDolarGrafikBtn").disabled = false;
  document.getElementById("hitungDolarBaruBtn").style.display = "inline-block";

  // Simpan data untuk chart
  window.dolarChartData = {
    dataPoints: data,
    interpolatedPoint: { x: xInput, y: hasil },
  };

  // Simpan ke history
  const historyItem = {
    timestamp: timestamp,
    xValue: xInput,
    result: hasil.toFixed(2),
    dataPoints: data,
    calculation: window.dolarLatestResult,
    type: "dolar",
  };

  // Save to history
  if (window.history && window.history.saveToHistory) {
    window.history.saveToHistory(historyItem);
    window.history.renderHistory();
  }

  // Render chart
  renderDolarChart();
}

function renderDolarChart() {
  if (!window.dolarChartData) return;

  const ctx = document.getElementById("dolarChartCanvas").getContext("2d");
  if (window.dolarChart) window.dolarChart.destroy();

  window.dolarChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Data Kurs",
          data: window.dolarChartData.dataPoints.map((d) => ({
            x: d.x,
            y: d.y,
          })),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.7)",
          showLine: true,
          tension: 0.3,
          pointStyle: "circle",
          pointRadius: 6,
          borderWidth: 1,
        },
        {
          label: `Titik Interpolasi (X = ${window.dolarChartData.interpolatedPoint.x.toFixed(
            2
          )})`,
          data: [window.dolarChartData.interpolatedPoint],
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
              `Hari: ${context.parsed.x.toFixed(
                0
              )}, Nilai: Rp${context.parsed.y.toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Hari (X)",
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
            text: "Nilai Kurs (IDR)",
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

function handleDolarCSV(event) {
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

    document.getElementById("dolarDataInput").value = dataLines.join("\n");
  };
  reader.readAsText(file);
}

function resetDolarForm() {
  document.getElementById("dolarDataInput").value = "";
  document.getElementById("dolarCsvFile").value = "";
  document.getElementById("dolarXInput").value = "";
  document.getElementById("dolarHasilOutput").innerText =
    "Hasil akan ditampilkan di sini...";
  document.getElementById("dolarHasilOutput").classList.remove("error");
  document.getElementById("unduhDolarHasilBtn").disabled = true;
  document.getElementById("unduhDolarGrafikBtn").disabled = true;
  document.getElementById("hitungDolarBaruBtn").style.display = "none";

  if (window.dolarChart) {
    window.dolarChart.destroy();
    window.dolarChart = null;
  }
}

function downloadDolarHasil() {
  if (!window.dolarLatestResult) {
    alert("Belum ada hasil untuk diunduh.");
    return;
  }

  const blob = new Blob([window.dolarLatestResult], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hasil_interpolasi_dolar.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadDolarGrafik() {
  if (!window.dolarChart) {
    alert("Belum ada grafik untuk diunduh.");
    return;
  }

  const imageLink = document.createElement("a");
  imageLink.download = "grafik_interpolasi_dolar.png";
  imageLink.href = window.dolarChart.canvas.toDataURL("image/png");
  imageLink.click();
}

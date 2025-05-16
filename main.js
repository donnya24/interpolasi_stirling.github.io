<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function() {
  // Initialize variables
  window.latestResult = "";
  window.chartData = null;
  
  // Setup event listeners
  document.getElementById('csvFile').addEventListener('change', handleCSV);
  document.getElementById('hitungBtn').addEventListener('click', hitungStirling);
  document.getElementById('hitungBaruBtn').addEventListener('click', resetForm);
  document.getElementById('unduhHasilBtn').addEventListener('click', downloadHasil);
  document.getElementById('unduhGrafikBtn').addEventListener('click', downloadGrafik);
});

function hitungStirling() {
  // Reset error state
  document.getElementById("hasilOutput").classList.remove("error");
  
  const inputText = document.getElementById("dataInput").value;
  const xInput = parseFloat(document.getElementById("xInput").value);
  
  if (!inputText || isNaN(xInput)) {
    document.getElementById("hasilOutput").innerText = "Harap masukkan data dan nilai X yang valid";
    document.getElementById("hasilOutput").classList.add("error");
    return;
  }

  const data = parseData(inputText);
  if (!data) return;

  const n = data.length;

  if (n < 5 || n % 2 === 0) {
    document.getElementById("hasilOutput").innerText = "Jumlah data harus ganjil dan minimal 5.";
    document.getElementById("hasilOutput").classList.add("error");
    return;
  }

  // Sort data berdasarkan x
  data.sort((a, b) => a.x - b.x);
  
  // Hitung selisih interval h
  const h = data[1].x - data[0].x;
  
  // Validasi interval seragam
  for (let i = 1; i < data.length; i++) {
    if (Math.abs((data[i].x - data[i-1].x) - h) > 0.0001) {
      document.getElementById("hasilOutput").innerText = "Interval data X harus seragam";
      document.getElementById("hasilOutput").classList.add("error");
      return;
    }
  }

  const mid = Math.floor(n / 2);
  const u = (xInput - data[mid].x) / h;

  // Membuat tabel selisih
  const diffTable = Array(n).fill().map(() => Array(n).fill(0));
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
      hasil += (uTerm / fact) * ((diffTable[mid - k + 1][i] + diffTable[mid - k][i]) / 2);
      k++;
    } else {
      uTerm *= (u - (k - 1));
      hasil += (uTerm / fact) * diffTable[mid - (k - 1)][i];
    }
  }

  // Format hasil
  const timestamp = new Date().toLocaleString();
  window.latestResult = `Hasil interpolasi suhu pada X = ${xInput} adalah: ${hasil.toFixed(4)} °C\n\nData yang digunakan:\n${data.map(d => `x: ${d.x}, y: ${d.y}`).join("\n")}`;
  
  // Tampilkan hasil
  document.getElementById("hasilOutput").innerText = window.latestResult;
  document.getElementById("unduhHasilBtn").disabled = false;
  document.getElementById("unduhGrafikBtn").disabled = false;
  document.getElementById("hitungBaruBtn").style.display = "inline-block";

  // Simpan data untuk chart
  window.chartData = {
    dataPoints: data,
    interpolatedPoint: { x: xInput, y: hasil }
  };

  // Simpan ke history
  const historyItem = {
    timestamp: timestamp,
    xValue: xInput,
    result: hasil.toFixed(4),
    dataPoints: data,
    calculation: window.latestResult
  };
  
  // Save to history
  if (window.history && window.history.saveToHistory) {
    window.history.saveToHistory(historyItem);
    window.history.renderHistory();
  }
  
  // Render chart
  if (window.renderChart) {
    window.renderChart();
  }
}
=======
/**
 * Updated main.js to update type parameter for original suhu functionality
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize variables
  window.latestResult = "";
  window.chartData = null;

  // Setup event listeners
  document.getElementById("csvFile").addEventListener("change", handleCSV);
  document
    .getElementById("hitungBtn")
    .addEventListener("click", hitungStirling);
  document.getElementById("hitungBaruBtn").addEventListener("click", resetForm);
  document
    .getElementById("unduhHasilBtn")
    .addEventListener("click", downloadHasil);
  document
    .getElementById("unduhGrafikBtn")
    .addEventListener("click", downloadGrafik);
});

function hitungStirling() {
  // Reset error state
  document.getElementById("hasilOutput").classList.remove("error");

  const inputText = document.getElementById("dataInput").value;
  const xInput = parseFloat(document.getElementById("xInput").value);

  if (!inputText || isNaN(xInput)) {
    document.getElementById("hasilOutput").innerText =
      "Harap masukkan data dan nilai X yang valid";
    document.getElementById("hasilOutput").classList.add("error");
    return;
  }

  const data = parseData(inputText);
  if (!data) return;

  const n = data.length;

  if (n < 5 || n % 2 === 0) {
    document.getElementById("hasilOutput").innerText =
      "Jumlah data harus ganjil dan minimal 5.";
    document.getElementById("hasilOutput").classList.add("error");
    return;
  }

  // Sort data berdasarkan x
  data.sort((a, b) => a.x - b.x);

  // Hitung selisih interval h
  const h = data[1].x - data[0].x;

  // Validasi interval seragam
  for (let i = 1; i < data.length; i++) {
    if (Math.abs(data[i].x - data[i - 1].x - h) > 0.0001) {
      document.getElementById("hasilOutput").innerText =
        "Interval data X harus seragam";
      document.getElementById("hasilOutput").classList.add("error");
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
  window.latestResult = `Hasil interpolasi suhu pada X = ${xInput} adalah: ${hasil.toFixed(
    4
  )} °C\n\nData yang digunakan:\n${data
    .map((d) => `x: ${d.x}, y: ${d.y}`)
    .join("\n")}`;

  // Tampilkan hasil
  document.getElementById("hasilOutput").innerText = window.latestResult;
  document.getElementById("unduhHasilBtn").disabled = false;
  document.getElementById("unduhGrafikBtn").disabled = false;
  document.getElementById("hitungBaruBtn").style.display = "inline-block";

  // Simpan data untuk chart
  window.chartData = {
    dataPoints: data,
    interpolatedPoint: { x: xInput, y: hasil },
  };

  // Simpan ke history dengan menambahkan type 'suhu'
  const historyItem = {
    timestamp: timestamp,
    xValue: xInput,
    result: hasil.toFixed(4),
    dataPoints: data,
    calculation: window.latestResult,
    type: "suhu", // Menambahkan type untuk identifikasi
  };

  // Save to history
  if (window.history && window.history.saveToHistory) {
    window.history.saveToHistory(historyItem);
    window.history.renderHistory();
  }

  // Render chart
  if (window.renderChart) {
    window.renderChart();
  }
}
>>>>>>> c356c8c (Update 16)

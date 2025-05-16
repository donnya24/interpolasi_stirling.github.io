function parseData(input) {
  try {
    return input
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const parts = line.split(",").map((part) => parseFloat(part.trim()));
        if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
          throw new Error(`Format data tidak valid: ${line}`);
        }
        return { x: parts[0], y: parts[1] };
      });
  } catch (error) {
    document.getElementById("hasilOutput").innerText = error.message;
    document.getElementById("hasilOutput").classList.add("error");
    return null;
  }
}

function handleCSV(event) {
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

    document.getElementById("dataInput").value = dataLines.join("\n");
  };
  reader.readAsText(file);
}

function resetForm() {
  document.getElementById("dataInput").value = "";
  document.getElementById("csvFile").value = "";
  document.getElementById("xInput").value = "";
  document.getElementById("hasilOutput").innerText =
    "Hasil akan ditampilkan di sini...";
  document.getElementById("hasilOutput").classList.remove("error");
  document.getElementById("unduhHasilBtn").disabled = true;
  document.getElementById("unduhGrafikBtn").disabled = true;
  document.getElementById("hitungBaruBtn").style.display = "none";

  if (window.chart) {
    window.chart.destroy();
    window.chart = null;
  }
}

function downloadHasil() {
  if (!window.latestResult) {
    alert("Belum ada hasil untuk diunduh.");
    return;
  }

  const blob = new Blob([window.latestResult], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "hasil_interpolasi_stirling.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

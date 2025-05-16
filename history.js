<<<<<<< HEAD
const history = {
  calculationHistory: JSON.parse(localStorage.getItem('stirlingHistory')) || [],

  saveToHistory(item) {
    this.calculationHistory.unshift(item);
    if (this.calculationHistory.length > 10) {
      this.calculationHistory = this.calculationHistory.slice(0, 10);
    }
    localStorage.setItem('stirlingHistory', JSON.stringify(this.calculationHistory));
  },

  renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (this.calculationHistory.length === 0) {
      historyList.innerHTML = '<p>Belum ada riwayat perhitungan</p>';
      return;
    }

    this.calculationHistory.forEach((item, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <h4>Perhitungan #${index + 1}</h4>
        <p><strong>Nilai X:</strong> ${item.xValue}</p>
        <p><strong>Hasil:</strong> ${item.result} °C</p>
        <p><strong>Jumlah data:</strong> ${item.dataPoints.length}</p>
        <p class="time">${item.timestamp}</p>
        <button class="view-history-btn" data-index="${index}"><i class="fas fa-eye"></i> Lihat Detail</button>
      `;
      historyList.appendChild(historyItem);
    });

    // Add event listeners to all view buttons
    document.querySelectorAll('.view-history-btn').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index'));
        this.viewHistoryItem(index);
      });
    });
  },

  viewHistoryItem(index) {
    if (index >= 0 && index < this.calculationHistory.length) {
      const item = this.calculationHistory[index];
      window.latestResult = item.calculation;
      document.getElementById("hasilOutput").innerText = window.latestResult;
      document.getElementById("unduhHasilBtn").disabled = false;
      document.getElementById("unduhGrafikBtn").disabled = false;
      
      window.chartData = {
        dataPoints: item.dataPoints,
        interpolatedPoint: { x: item.xValue, y: parseFloat(item.result) }
      };
      
      if (window.renderChart) {
        window.renderChart();
      }
      document.getElementById("hitungBaruBtn").style.display = "inline-block";
    }
  },

  clearHistory() {
    if (confirm("Apakah Anda yakin ingin menghapus semua riwayat perhitungan?")) {
      this.calculationHistory = [];
      localStorage.setItem('stirlingHistory', JSON.stringify(this.calculationHistory));
      this.renderHistory();
    }
  }
};

// Initialize history
document.addEventListener('DOMContentLoaded', function() {
  history.renderHistory();
  
  // Add event listener to clear history button
  document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    history.clearHistory();
  });
});
=======
/**
 * Updated history.js to handle multiple types of calculations
 */
const history = {
  calculationHistory: JSON.parse(localStorage.getItem("stirlingHistory")) || [],

  saveToHistory(item) {
    // Default type to 'suhu' if not specified
    if (!item.type) {
      item.type = "suhu";
    }

    this.calculationHistory.unshift(item);
    if (this.calculationHistory.length > 15) {
      this.calculationHistory = this.calculationHistory.slice(0, 15);
    }
    localStorage.setItem(
      "stirlingHistory",
      JSON.stringify(this.calculationHistory)
    );
  },

  renderHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    if (this.calculationHistory.length === 0) {
      historyList.innerHTML = "<p>Belum ada riwayat perhitungan</p>";
      return;
    }

    this.calculationHistory.forEach((item, index) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";

      // Set icon and title based on calculation type
      let typeIcon = "fa-temperature-high";
      let typeTitle = "Suhu";
      let unitLabel = "°C";

      if (item.type === "dolar") {
        typeIcon = "fa-dollar-sign";
        typeTitle = "Nilai Dolar";
        unitLabel = "IDR";
      } else if (item.type === "semester") {
        typeIcon = "fa-graduation-cap";
        typeTitle = "IPK Semester";
        unitLabel = "";
      }

      historyItem.innerHTML = `
        <h4><i class="fas ${typeIcon}"></i> ${typeTitle} #${index + 1}</h4>
        <p><strong>Nilai X:</strong> ${item.xValue}</p>
        <p><strong>Hasil:</strong> ${item.result}${unitLabel}</p>
        <p><strong>Jumlah data:</strong> ${item.dataPoints.length}</p>
        <p class="time">${item.timestamp}</p>
        <button class="view-history-btn" data-index="${index}"><i class="fas fa-eye"></i> Lihat Detail</button>
      `;
      historyList.appendChild(historyItem);
    });

    // Add event listeners to all view buttons
    document.querySelectorAll(".view-history-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const index = parseInt(button.getAttribute("data-index"));
        this.viewHistoryItem(index);
      });
    });
  },

  viewHistoryItem(index) {
    if (index >= 0 && index < this.calculationHistory.length) {
      const item = this.calculationHistory[index];

      // Switch to appropriate tab based on calculation type
      const tabType = item.type || "suhu";
      const tabButton = document.querySelector(
        `.tab-button[data-tab="${tabType}"]`
      );
      if (tabButton) {
        tabButton.click();
      }

      // Set appropriate variables based on type
      if (tabType === "suhu") {
        window.latestResult = item.calculation;
        document.getElementById("hasilOutput").innerText = window.latestResult;
        document.getElementById("unduhHasilBtn").disabled = false;
        document.getElementById("unduhGrafikBtn").disabled = false;
        document.getElementById("hitungBaruBtn").style.display = "inline-block";

        window.chartData = {
          dataPoints: item.dataPoints,
          interpolatedPoint: { x: item.xValue, y: parseFloat(item.result) },
        };

        if (window.renderChart) {
          window.renderChart();
        }
      } else if (tabType === "dolar") {
        window.dolarLatestResult = item.calculation;
        document.getElementById("dolarHasilOutput").innerText =
          window.dolarLatestResult;
        document.getElementById("unduhDolarHasilBtn").disabled = false;
        document.getElementById("unduhDolarGrafikBtn").disabled = false;
        document.getElementById("hitungDolarBaruBtn").style.display =
          "inline-block";

        window.dolarChartData = {
          dataPoints: item.dataPoints,
          interpolatedPoint: { x: item.xValue, y: parseFloat(item.result) },
        };

        if (window.renderDolarChart) {
          window.renderDolarChart();
        }
      } else if (tabType === "semester") {
        window.semesterLatestResult = item.calculation;
        document.getElementById("semesterHasilOutput").innerText =
          window.semesterLatestResult;
        document.getElementById("unduhSemesterHasilBtn").disabled = false;
        document.getElementById("unduhSemesterGrafikBtn").disabled = false;
        document.getElementById("hitungSemesterBaruBtn").style.display =
          "inline-block";

        window.semesterChartData = {
          dataPoints: item.dataPoints,
          interpolatedPoint: { x: item.xValue, y: parseFloat(item.result) },
        };

        if (window.renderSemesterChart) {
          window.renderSemesterChart();
        }
      }
    }
  },

  clearHistory() {
    if (
      confirm("Apakah Anda yakin ingin menghapus semua riwayat perhitungan?")
    ) {
      this.calculationHistory = [];
      localStorage.setItem(
        "stirlingHistory",
        JSON.stringify(this.calculationHistory)
      );
      this.renderHistory();
    }
  },
};

// Initialize history
document.addEventListener("DOMContentLoaded", function () {
  // Make history object available globally
  window.history = history;

  history.renderHistory();

  // Add event listener to clear history button
  document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    history.clearHistory();
  });
});
>>>>>>> c356c8c (Update 16)

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
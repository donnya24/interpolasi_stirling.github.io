<<<<<<< HEAD
function renderChart() {
  if (!window.chartData) return;

  const ctx = document.getElementById('chartCanvas').getContext('2d');
  if (window.chart) window.chart.destroy();

  window.chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Data Suhu',
          data: window.chartData.dataPoints.map(d => ({ x: d.x, y: d.y })),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          showLine: true,
          tension: 0.3,
          pointStyle: 'circle',
          pointRadius: 6,
          borderWidth: 1
        },
        {
          label: `Titik Interpolasi (X = ${window.chartData.interpolatedPoint.x.toFixed(2)})`,
          data: [window.chartData.interpolatedPoint],
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointStyle: 'triangle',
          pointRadius: 8,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: context => `x: ${context.parsed.x.toFixed(2)}, y: ${context.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        x: {
          title: { 
            display: true, 
            text: 'Waktu (X)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: { 
            display: true, 
            text: 'Suhu (Y)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      elements: {
        line: {
          borderWidth: 2,
          fill: false
        }
      }
    }
  });
}

function downloadGrafik() {
  if (!window.chart) {
    alert("Belum ada grafik untuk diunduh.");
    return;
  }

  const imageLink = document.createElement('a');
  imageLink.download = 'grafik_interpolasi_stirling.png';
  imageLink.href = window.chart.canvas.toDataURL('image/png');
  imageLink.click();
=======
function renderChart() {
  if (!window.chartData) return;

  const ctx = document.getElementById('chartCanvas').getContext('2d');
  if (window.chart) window.chart.destroy();

  window.chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Data Suhu',
          data: window.chartData.dataPoints.map(d => ({ x: d.x, y: d.y })),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          showLine: true,
          tension: 0.3,
          pointStyle: 'circle',
          pointRadius: 6,
          borderWidth: 1
        },
        {
          label: `Titik Interpolasi (X = ${window.chartData.interpolatedPoint.x.toFixed(2)})`,
          data: [window.chartData.interpolatedPoint],
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointStyle: 'triangle',
          pointRadius: 8,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: context => `x: ${context.parsed.x.toFixed(2)}, y: ${context.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        x: {
          title: { 
            display: true, 
            text: 'Waktu (X)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: { 
            display: true, 
            text: 'Suhu (Y)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      elements: {
        line: {
          borderWidth: 2,
          fill: false
        }
      }
    }
  });
}

function downloadGrafik() {
  if (!window.chart) {
    alert("Belum ada grafik untuk diunduh.");
    return;
  }

  const imageLink = document.createElement('a');
  imageLink.download = 'grafik_interpolasi_stirling.png';
  imageLink.href = window.chart.canvas.toDataURL('image/png');
  imageLink.click();
>>>>>>> c356c8c (Update 16)
}
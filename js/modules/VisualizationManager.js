export class VisualizationManager {
    constructor() {
        this.chart = null;
        this.chartContainer = document.querySelector('.chart-container'); // Reference to the chart container
        this.initializeChart();
        this.hideChart(); // Initially hide the chart
        this.createResultContainer(); // Create and append the result container
    }

    initializeChart() {
        const ctx = document.getElementById('visualizationChart');
        if (!ctx) {
            console.error('Visualization chart canvas not found');
            return;
        }

        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Perception', 'Action', 'Memory', 'Learning', 'Goal Orientation'],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        min: 0,
                        ticks: {
                            stepSize: 20,
                            font: {
                                size: 12
                            }
                        },
                        pointLabels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }

    createResultContainer() {
        this.resultContainer = document.createElement('div'); // Create a container for results
        this.resultContainer.className = 'comparison-result';
        this.resultContainer.style.display = 'none'; // Initially hidden
        if (this.chartContainer) {
            this.chartContainer.parentNode.insertBefore(this.resultContainer, this.chartContainer.nextSibling); // Append below the chart
        }
    }

    addEntity(entity) {
        if (!this.chart) {
            console.error('Chart not initialized');
            return;
        }

        this.showChart(); // Make the chart visible when an entity is added

        const color = this.getEntityColor(entity.type);
        const dataset = {
            label: this.getEntityLabel(entity.type),
            data: [
                entity.dimensions.perception,
                entity.dimensions.action,
                entity.dimensions.memory,
                entity.dimensions.learning,
                entity.dimensions.goalOrientation
            ],
            backgroundColor: color + '40',
            borderColor: color,
            borderWidth: 2,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: color,
            pointRadius: 4,
            pointHoverRadius: 6
        };

        this.chart.data.datasets.push(dataset);
        this.chart.update('default');
    }

    updateEntity(entity) {
        if (!this.chart) {
            console.error('Chart not initialized');
            return;
        }

        const index = this.chart.data.datasets.findIndex(dataset => dataset.label === this.getEntityLabel(entity.type));
        if (index !== -1) {
            this.chart.data.datasets[index].data = [
                entity.dimensions.perception,
                entity.dimensions.action,
                entity.dimensions.memory,
                entity.dimensions.learning,
                entity.dimensions.goalOrientation
            ];
            this.chart.update('default');
        }
    }

    removeEntity(entityType) {
        if (!this.chart) {
            console.error('Chart not initialized');
            return;
        }

        const label = this.getEntityLabel(entityType);
        const index = this.chart.data.datasets.findIndex(dataset => dataset.label === label);
        if (index !== -1) {
            this.chart.data.datasets.splice(index, 1);
            this.chart.update('default');
        }

        if (this.chart.data.datasets.length === 0) {
            this.hideChart(); // Hide the chart if no datasets remain
        }
    }

    getEntityColor(type) {
        const colors = {
            human: '#4CAF50',
            dog: '#2196F3',
            ai: '#9C27B0'
        };
        return colors[type] || '#757575';
    }

    getEntityLabel(type) {
        const labels = {
            human: 'Human',
            dog: 'Dog',
            ai: 'AI Bot'
        };
        return labels[type] || type;
    }

    exportChart() {
        if (!this.chart) {
            console.error('Chart not initialized');
            return;
        }

        const link = document.createElement('a');
        link.download = 'consciousness-continuum.png';
        link.href = this.chart.toBase64Image('image/png', 1.0);
        link.click();
    }

    reset() {
        if (!this.chart) {
            console.error('Chart not initialized');
            return;
        }

        this.chart.data.datasets = [];
        this.chart.update('default');
        this.hideChart(); // Hide the chart on reset
        if (this.resultContainer) {
            this.resultContainer.innerHTML = ''; // Clear the result
            this.resultContainer.style.display = 'none'; // Hide the result container
        }
    }

    showChart() {
        if (this.chartContainer) {
            this.chartContainer.style.display = 'block';
        }
    }

    hideChart() {
        if (this.chartContainer) {
            this.chartContainer.style.display = 'none';
        }
    }

    calculateTotalScore(entity) {
        const { perception, action, memory, learning, goalOrientation } = entity.dimensions;
        return perception + action + memory + learning + goalOrientation;
    }

    compareEntities(entity1, entity2) {
        const score1 = this.calculateTotalScore(entity1);
        const score2 = this.calculateTotalScore(entity2);

        let resultMessage = '';
        if (score1 > score2) {
            resultMessage = `
                <p><strong>${entity1.type}</strong> is more conscious with a total score of <strong>${score1}</strong>.</p>
                <p><strong>${entity2.type}</strong> has a total score of <strong>${score2}</strong>.</p>
            `;
        } else if (score2 > score1) {
            resultMessage = `
                <p><strong>${entity2.type}</strong> is more conscious with a total score of <strong>${score2}</strong>.</p>
                <p><strong>${entity1.type}</strong> has a total score of <strong>${score1}</strong>.</p>
            `;
        } else {
            resultMessage = `
                <p>Both <strong>${entity1.type}</strong> and <strong>${entity2.type}</strong> are equally conscious with a total score of <strong>${score1}</strong>.</p>
            `;
        }

        this.displayResult(resultMessage);
    }

    displayResult(message) {
        if (this.resultContainer) {
            this.resultContainer.innerHTML = message;
            this.resultContainer.style.display = 'block'; // Ensure the result is visible
        }
    }
}
export class VisualizationManager {
    constructor() {
        this.chart = null;
        this.initializeChart();
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

    addEntity(entity) {
        if (!this.chart) {
            console.error('Chart not initialized');
            return;
        }

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
    }

    calculateConsciousnessScore(entity) {
        const dimensions = entity.dimensions;
        const totalScore = dimensions.perception + dimensions.action + dimensions.memory + dimensions.learning + dimensions.goalOrientation;
        return totalScore / 5; // Average score
    }

    compareEntities(entity1, entity2) {
        const score1 = this.calculateConsciousnessScore(entity1);
        const score2 = this.calculateConsciousnessScore(entity2);

        let result = `Consciousness Comparison:\n`;
        result += `---------------------------------\n`;
        result += `${entity1.type} - Consciousness Score: ${score1.toFixed(2)}\n`;
        result += `${entity2.type} - Consciousness Score: ${score2.toFixed(2)}\n`;
        result += `---------------------------------\n`;

        if (score1 > score2) {
            result += `${entity1.type} is more conscious than ${entity2.type}.\n`;
        } else if (score1 < score2) {
            result += `${entity2.type} is more conscious than ${entity1.type}.\n`;
        } else {
            result += `${entity1.type} and ${entity2.type} have the same level of consciousness.\n`;
        }

        console.log(result);
        alert(result); // Display the result in a well-formatted form
    }
}
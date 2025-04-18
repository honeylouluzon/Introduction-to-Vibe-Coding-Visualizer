export class VisualizationManager {
    constructor() {
        this.chart = null;
        this.chartContainer = document.querySelector('.chart-container'); // Reference to the chart container
        this.resultContainer = document.querySelector('.comparison-result'); // Reference to the comparison result container
        this.thoughtDisplay = document.querySelector('.thought-display'); // Reference to the thought display container
        this.actionSection = document.querySelector('.action-section'); // Reference to the action section
        this.entitySelector = document.querySelector('.entity-selector'); // Reference to the entity selector
        this.conversationSection = document.querySelector('.conversation-section'); // Reference to the conversation section
        this.conversationBox = document.querySelector('.conversation-box'); // Reference to the conversation box
        this.conversationInterval = null; // Interval for automated conversation
        this.initializeChart();
        this.hideChart(); // Initially hide the chart
        this.initializeActions();
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

    initializeActions() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleAction(action);
            });
        });
    }

    updateActionSection(entities) {
        if (entities.length === 0) {
            this.actionSection.style.display = 'none'; // Hide the action section if no entities
            return;
        }

        this.actionSection.style.display = 'block'; // Show the action section
        this.entitySelector.innerHTML = ''; // Clear existing radio buttons

        entities.forEach((entity, index) => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="radio" name="selected-entity" value="entity${index}"> ${entity.type}
            `;
            this.entitySelector.appendChild(label);
        });

        // Automatically select the first entity
        if (entities.length > 0) {
            this.entitySelector.querySelector('input').checked = true;
        }
    }

    handleAction(action) {
        const selectedEntity = document.querySelector('input[name="selected-entity"]:checked');
        if (!selectedEntity) {
            alert('Please select an entity to perform the action.');
            return;
        }

        const entityIndex = parseInt(selectedEntity.value.replace('entity', ''), 10);
        const entities = window.app.entityManager.getAllEntities();
        if (!entities[entityIndex]) {
            alert('Selected entity is not available.');
            return;
        }

        const entity = entities[entityIndex];
        const improvementText = this.applyActionEffects(entity, action);
        this.displayThought(entity.type, action, improvementText);
        window.app.visualizationManager.updateEntity(entity);

        // Update sliders to reflect the new dimensions
        this.updateSliders(entity);

        const updatedEntities = window.app.entityManager.getAllEntities();
        if (updatedEntities.length >= 2) {
            this.compareEntities(updatedEntities[0], updatedEntities[1]);
        }
    }

    applyActionEffects(entity, action) {
        const effects = {
            reading: { perception: 5, memory: 10 },
            chatting: { action: 5, learning: 5 },
            traveling: { perception: 10, goalOrientation: 5 },
            exercising: { action: 10, goalOrientation: 5 },
            meditating: { memory: 5, learning: 10 },
            cooking: { learning: 5, goalOrientation: 5 }
        };

        const effect = effects[action];
        let improvementText = '<u>Improvement:</u> ';
        if (effect) {
            for (const [dimension, value] of Object.entries(effect)) {
                entity.dimensions[dimension] = Math.min(100, entity.dimensions[dimension] + value);
                improvementText += `+${value} ${dimension}, `;
            }
        }
        return improvementText.slice(0, -2); // Remove trailing comma and space
    }

    updateSliders(entity) {
        const sliders = document.querySelectorAll(`[data-entity-id="${entity.id}"] .dimension-slider input[type="range"]`);
        sliders.forEach(slider => {
            const dimension = slider.id.split('-').pop(); // Extract the dimension name from the slider ID
            if (entity.dimensions[dimension] !== undefined) {
                slider.value = entity.dimensions[dimension];
                slider.nextElementSibling.textContent = entity.dimensions[dimension]; // Update the displayed value
            }
        });
    }

    displayThought(entityType, action, improvementText) {
        const thoughts = {
            reading: [
                `"I love immersing myself in this story."`,
                `"This book is so captivating, I can't put it down."`,
                `"Learning new things is always exciting."`
            ],
            chatting: [
                `"It's great to connect with others and share ideas."`,
                `"I enjoy hearing different perspectives."`,
                `"Conversations like these make my day brighter."`
            ],
            traveling: [
                `"The view is so nice, nature is relaxing, I like the sea breeze and the feeling of the sand touching my feet."`,
                `"The city lights are so overwhelming, it will be fun here."`,
                `"Exploring new places always fills me with joy."`
            ],
            exercising: [
                `"The dumbbell is so heavy, I will gain more muscle with this."`,
                `"I feel so energized after a good workout."`,
                `"Pushing my limits makes me feel alive."`
            ],
            meditating: [
                `"I feel so calm and centered right now."`,
                `"Clearing my mind helps me focus better."`,
                `"Meditation brings me peace and clarity."`
            ],
            cooking: [
                `"The aroma of fresh ingredients is so delightful."`,
                `"Cooking is like creating art with flavors."`,
                `"I can't wait to taste this delicious meal."`
            ]
        };

        const randomThought = thoughts[action][Math.floor(Math.random() * thoughts[action].length)];
        const thoughtText = `${entityType} is thinking: ${randomThought}`;
        this.thoughtDisplay.innerHTML = `${thoughtText}<br>${improvementText}`;
        this.thoughtDisplay.style.display = 'block';

        setTimeout(() => {
            this.thoughtDisplay.style.display = 'none';
        }, 20000); // Display the thought for 20 seconds
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
            this.resultContainer.innerHTML = message; // Update the content of the result container
            this.resultContainer.style.display = 'block'; // Ensure the result is visible
        } else {
            console.error('Result container not found.');
        }
    }

    updateConversationSection(entities) {
        if (entities.length < 2) {
            this.conversationSection.style.display = 'none'; // Hide the conversation section if less than 2 entities
            if (this.conversationInterval) clearInterval(this.conversationInterval);
            return;
        }

        this.conversationSection.style.display = 'block'; // Show the conversation section
        this.startConversation(entities);
    }

    startConversation(entities) {
        if (this.conversationInterval) clearInterval(this.conversationInterval);

        this.conversationInterval = setInterval(() => {
            const [entity1, entity2] = entities;
            const question = this.getQuestion(entity1);
            const answer = this.getAnswer(entity2, question);

            this.addConversationLine(entity1.type, question);
            setTimeout(() => {
                this.addConversationLine(entity2.type, answer);
            }, 2000); // Delay the response by 2 seconds
        }, 5000); // New conversation every 5 seconds
    }

    getQuestion(entity) {
        const questions = {
            perception: [
                "What do you see around you?",
                "How do you perceive the world today?",
                "What catches your attention the most?"
            ],
            action: [
                "What activity are you planning to do?",
                "How do you stay active?",
                "What motivates you to take action?"
            ],
            memory: [
                "What is your favorite memory?",
                "How do you remember important things?",
                "What is something you will never forget?"
            ],
            learning: [
                "What have you learned recently?",
                "How do you approach learning new things?",
                "What is the most interesting thing you've studied?"
            ],
            goalOrientation: [
                "What is your current goal?",
                "How do you stay focused on your objectives?",
                "What drives you to achieve your ambitions?"
            ]
        };

        const dimension = this.getHighestDimension(entity);
        const dimensionQuestions = questions[dimension];
        return dimensionQuestions[Math.floor(Math.random() * dimensionQuestions.length)];
    }

    getAnswer(entity, question) {
        const answers = {
            perception: [
                "I see a beautiful landscape.",
                "The world looks vibrant and full of life.",
                "I notice the small details that others might miss."
            ],
            action: [
                "I plan to go for a run.",
                "Staying active keeps me energized.",
                "I enjoy taking on new challenges."
            ],
            memory: [
                "I remember my childhood fondly.",
                "I keep a journal to remember important events.",
                "Some memories are etched in my mind forever."
            ],
            learning: [
                "I recently learned about quantum physics.",
                "I enjoy exploring new topics every day.",
                "Learning keeps my mind sharp and curious."
            ],
            goalOrientation: [
                "My goal is to become the best version of myself.",
                "I stay focused by breaking my goals into smaller tasks.",
                "Ambition drives me to keep moving forward."
            ]
        };

        const dimension = this.getHighestDimension(entity);
        const dimensionAnswers = answers[dimension];
        return dimensionAnswers[Math.floor(Math.random() * dimensionAnswers.length)];
    }

    getHighestDimension(entity) {
        const dimensions = entity.dimensions;
        return Object.keys(dimensions).reduce((a, b) => (dimensions[a] > dimensions[b] ? a : b));
    }

    addConversationLine(sender, text) {
        const line = document.createElement('div');
        line.innerHTML = `<strong>${sender}:</strong> ${text}`;
        this.conversationBox.appendChild(line);
        this.conversationBox.scrollTop = this.conversationBox.scrollHeight; // Auto-scroll to the latest message
    }
}
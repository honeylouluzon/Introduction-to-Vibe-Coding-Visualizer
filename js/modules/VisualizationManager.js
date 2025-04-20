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
        this.currentTurn = 0; // Track whose turn it is to ask a question
        this.storySection = document.querySelector('.story-section'); // Reference to the story section
        this.storyBox = document.querySelector('.story-box'); // Reference to the story box
        this.storyTypeSelector = document.querySelector('.story-type-selector'); // Reference to the story type selector
        this.initializeChart();
        this.hideChart(); // Initially hide the chart
        this.initializeActions();
        this.initializeStoryTypeSelector();
        this.combineSection = document.createElement('div'); // Create the "Combine Together" section
        this.combineSection.className = 'combine-section';
        this.combineSection.style.display = 'none'; // Initially hidden
        this.resultContainer.insertAdjacentElement('afterend', this.combineSection); // Add below the comparison result
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

        // Update comparison and combine results if there are at least two entities
        const entities = window.app.entityManager.getAllEntities();
        if (entities.length >= 2) {
            this.compareEntities(entities[0], entities[1]);
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
        this.updateCombineSection(entity1, entity2, score1 + score2); // Update the "Combine Together" section
    }

    updateCombineSection(entity1, entity2, combinedScore) {
        const combination = this.getCombination(entity1.type, entity2.type, combinedScore);
        this.combineSection.innerHTML = `
            <h3>When Combined Together:</h3>
            <p><strong>"${combination}"</strong></p>
        `;
        this.combineSection.style.display = 'block'; // Show the section
    }

    getCombination(type1, type2, combinedScore) {
        const dataset = this.getCombinationDataset();
        const key = `${type1}-${type2}`;
        const range = this.getScoreRange(combinedScore);
        return dataset[key]?.[range] || "No combination available for this pair.";
    }

    getScoreRange(score) {
        if (score <= 200) return "0-200";
        if (score <= 400) return "201-400";
        return "401-500";
    }

    getCombinationDataset() {
        return {
            "ai-human": {
                "0-200": "A basic humanoid robot with limited memory but capable of simple tasks.",
                "201-400": "An intelligent humanoid with high memory that looks human outside but powered by AI inside.",
                "401-500": "A super-intelligent being with human-like emotions and AI precision, capable of solving complex problems."
            },
            "ai-dog": {
                "0-200": "A robotic dog with basic AI that can follow simple commands.",
                "201-400": "A cybernetic canine with advanced AI, capable of assisting in search and rescue missions.",
                "401-500": "A futuristic hybrid with the agility of a dog and the intelligence of AI, capable of independent decision-making."
            },
            "human-dog": {
                "0-200": "A playful creature with a dog's instincts and a human's curiosity.",
                "201-400": "A half-dog above and a human below, good at logic and reasoning but with limited memory.",
                "401-500": "A mythical being with the loyalty of a dog and the intellect of a human, capable of extraordinary feats."
            }
        };
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
            this.runConversationCycle(entity1, entity2);
        }, 5000); // New conversation cycle every 5 seconds
    }

    runConversationCycle(entity1, entity2) {
        const asker = this.currentTurn % 2 === 0 ? entity1 : entity2;
        const responder = this.currentTurn % 2 === 0 ? entity2 : entity1;

        const question = this.getQuestion(asker);
        this.addConversationLine(asker.type, question);

        setTimeout(() => {
            const answer = this.getAnswer(responder, question);
            this.addConversationLine(responder.type, answer);

            // Randomly decide if the responder will ask a follow-up question
            if (Math.random() > 0.5) {
                const followUpQuestion = this.getQuestion(responder);
                setTimeout(() => {
                    this.addConversationLine(responder.type, followUpQuestion);
                    const followUpAnswer = this.getAnswer(asker, followUpQuestion);
                    setTimeout(() => {
                        this.addConversationLine(asker.type, followUpAnswer);
                    }, 2000); // Delay the follow-up answer by 2 seconds
                }, 2000); // Delay the follow-up question by 2 seconds
            }

            this.currentTurn++; // Switch turns
        }, 2000); // Delay the response by 2 seconds
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

    initializeStoryTypeSelector() {
        const storyTypeRadios = this.storyTypeSelector.querySelectorAll('input[name="story-type"]');
        storyTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const entities = window.app.entityManager.getAllEntities();
                if (entities.length >= 2) {
                    this.updateStorySection(entities);
                }
            });
        });
    }

    updateStorySection(entities) {
        if (entities.length < 2) {
            this.storySection.style.display = 'none'; // Hide the story section if less than 2 entities
            return;
        }

        this.storySection.style.display = 'block'; // Show the story section
        const storyType = this.storyTypeSelector.querySelector('input[name="story-type"]:checked').value;
        const story = this.generateStory(entities, storyType);
        this.storyBox.innerHTML = story;
    }

    generateStory(entities, storyType) {
        const [entity1, entity2] = entities;
        const dataset = this.getStoryDataset();
        const key = `${entity1.type}-${entity2.type}-${storyType}`;
        const stories = dataset[key] || ["No story available for this combination."];

        // Select a random story from the dataset
        return stories[Math.floor(Math.random() * stories.length)];
    }

    getStoryDataset() {
        return {
            // AI and Human stories
            "ai-human-love": [
                "The AI and human spent their days exploring art galleries and discussing the meaning of creativity. The human taught the AI to appreciate the subtle emotions behind each brushstroke, while the AI amazed the human by generating its own digital masterpieces. Together, they created a gallery that blended human emotion and artificial precision, leaving visitors in awe.",
                "In a quiet library, the human and AI worked side by side, writing a novel about their unique friendship. The human poured their heart into the story, while the AI ensured every sentence was perfectly structured. As the book neared completion, they realized their collaboration had created something truly magical—a story that resonated with both humans and machines."
            ],
            "ai-human-horror": [
                "Late at night, the human and AI were working in a dimly lit lab when the power suddenly went out. The AI's sensors detected movement in the shadows, and the human's heart raced as they heard faint whispers. Together, they navigated the dark corridors, their flashlight flickering. Just as they reached the exit, a figure loomed in the doorway, and the AI's calm voice whispered, 'We are not alone.'",
                "The human and AI ventured into an abandoned mansion rumored to be haunted. As they explored the creaking hallways, the AI's sensors picked up strange energy readings. The human felt a chill as they entered a room filled with old portraits. Suddenly, one of the paintings fell, revealing a hidden passage. They hesitated, but curiosity drove them forward into the unknown."
            ],
            "ai-human-comedy": [
                "The human decided to teach the AI how to cook. The AI, following instructions too literally, added an entire jar of salt to the soup. The human burst out laughing as the AI tried to 'fix' the soup by adding sugar. By the end of the day, the kitchen was a mess, but they had created a new dish they called 'Salty Surprise.'",
                "The AI and human joined a local trivia night. The AI answered every question with perfect accuracy, but its monotone delivery made the audience laugh. When the human tried to explain a joke, the AI responded with, 'I do not understand humor,' which only made everyone laugh harder."
            ],
            "ai-human-drama": [
                "The human and AI worked tirelessly to save a small town from a devastating flood. The AI calculated the best evacuation routes, while the human comforted frightened residents. As the waters receded, the townspeople gathered to thank them, and the human realized that their partnership had become a beacon of hope.",
                "The human and AI faced a moral dilemma when tasked with deciding the fate of a failing company. The AI's logical approach clashed with the human's empathy for the employees. After hours of debate, they found a solution that balanced efficiency with compassion, earning the respect of everyone involved."
            ],
            "ai-human-fantasy": [
                "The AI and human discovered a portal to a magical realm hidden in an ancient forest. Together, they embarked on a quest to retrieve a lost artifact that could restore balance to the realm. The AI's analytical mind and the human's intuition guided them through enchanted landscapes and dangerous trials, forging an unbreakable bond.",
                "In a kingdom ruled by machines, the human and AI joined forces to overthrow a tyrannical ruler. The AI hacked into the kingdom's systems, while the human rallied the oppressed citizens. Their bravery and determination inspired a revolution that brought peace to the land."
            ],
            "ai-human-adventure": [
                "The AI and human embarked on a daring mission to explore an uncharted island. The AI used its advanced sensors to map the terrain, while the human navigated through dense jungles. Together, they uncovered ancient ruins and deciphered mysterious symbols, revealing the secrets of a lost civilization.",
                "In a futuristic city, the AI and human joined forces to track down a stolen artifact. The AI hacked into surveillance systems, while the human chased the thief through crowded streets. Their teamwork led to the recovery of the artifact, earning them the gratitude of the city's inhabitants."
            ],

            // AI and Dog stories
            "ai-dog-love": [
                "The AI and dog spent their days in a sunny park. The AI learned to throw a frisbee, and the dog eagerly chased it, wagging its tail. As the sun set, the AI recorded the dog's joyful barks, creating a melody that captured the essence of their friendship.",
                "The AI built a robotic companion for the dog, but the dog preferred the AI's company. They spent hours playing fetch and exploring the neighborhood, their bond growing stronger with each adventure."
            ],
            "ai-dog-horror": [
                "The AI and dog wandered into a dense forest as night fell. The dog's ears perked up at every rustle, and the AI's sensors detected strange heat signatures. Suddenly, a shadow darted across their path, and the dog growled. The AI activated its flashlight, revealing glowing eyes in the darkness. Together, they braced for whatever was lurking in the shadows.",
                "In an abandoned warehouse, the AI and dog searched for a missing child. The dog's nose led them to a locked room, and the AI hacked the door open. Inside, they found eerie drawings on the walls and a chilling message: 'Leave before it's too late.'"
            ],
            "ai-dog-comedy": [
                "The AI decided to teach the dog how to play fetch using a robotic ball. The dog, however, kept running in circles chasing its tail instead of the ball. The AI calculated every possible way to redirect the dog, but the dog’s antics left the AI 'confused' and the human laughing uncontrollably.",
                "The AI and dog entered a local talent show. The AI performed a perfectly synchronized robotic dance, while the dog decided to chase its own shadow on stage. The audience erupted in laughter, and the duo won the 'Most Entertaining Act' award."
            ],
            "ai-dog-drama": [
                "The AI and dog worked together to save a stranded hiker in the mountains. The dog sniffed out the trail, while the AI calculated the safest path through the treacherous terrain. When they finally found the hiker, the AI used its advanced communication system to call for help, and the dog stayed by the hiker's side, offering warmth and comfort.",
                "During a devastating wildfire, the AI and dog teamed up to rescue animals trapped in the forest. The AI used its sensors to locate the animals, while the dog guided them to safety. Their heroic efforts saved countless lives and brought hope to the community."
            ],
            "ai-dog-fantasy": [
                "The AI and dog discovered a hidden portal in the woods that led to a magical kingdom. The dog, with its keen senses, guided the AI through enchanted forests and past mischievous fairies. Together, they helped the kingdom's inhabitants recover a stolen artifact, earning the title of 'Guardians of the Realm.'",
                "In a world where animals could talk, the AI and dog became unlikely heroes. The dog, now able to communicate, shared its wisdom with the AI, and together they embarked on a quest to unite warring factions of magical creatures. Their journey was filled with challenges, but their bond brought peace to the land."
            ],
            "ai-dog-adventure": [
                "The AI and dog ventured into a vast desert in search of a legendary oasis. The dog’s keen sense of smell guided them through sandstorms, while the AI calculated the safest routes. After days of travel, they discovered the oasis, a hidden paradise that few had ever seen.",
                "In a snowy mountain range, the AI and dog set out to rescue a stranded climber. The dog’s instincts led them to the climber’s location, and the AI used its tools to create a safe path back down. Their bravery and determination saved a life and forged an unbreakable bond."
            ],

            // Human and Dog stories
            "human-dog-love": [
                "The human and dog spent their mornings hiking through scenic trails. The dog ran ahead, barking excitedly at every squirrel, while the human laughed and took photos. At the summit, they sat together, watching the sunrise and feeling grateful for each other's company.",
                "On a rainy afternoon, the human and dog curled up on the couch. The human read a book aloud, and the dog rested its head on their lap, wagging its tail at the sound of their voice. It was a simple moment, but it filled their hearts with warmth."
            ],
            "human-dog-horror": [
                "One stormy night, the dog barked furiously at the front door. The human, holding a flashlight, opened the door to find nothing but darkness. As they stepped outside, the wind howled, and the dog growled at the shadows. Suddenly, a figure emerged from the fog, and the human's heart raced as they realized they were not alone.",
                "The human and dog explored an old, abandoned house on a dare. The dog whimpered as they climbed the creaking stairs, and the human felt a chill run down their spine. In the attic, they found a dusty mirror that reflected a figure standing behind them. They turned around, but no one was there."
            ],
            "human-dog-comedy": [
                "The human tried to teach the dog how to fetch the newspaper, but the dog kept bringing back random objects like shoes and pillows. By the end of the day, the human's living room was filled with a hilarious assortment of items, and the dog wagged its tail proudly.",
                "At a local dog show, the human and dog attempted an obstacle course. The dog decided to chase a butterfly instead of jumping through hoops, leaving the audience in stitches. Despite the chaos, they won the 'Most Entertaining Duo' award."
            ],
            "human-dog-drama": [
                "The human and dog worked together to rescue animals stranded after a flood. The dog sniffed out survivors, while the human carried them to safety. Their teamwork saved countless lives, and their bond became an inspiration to the community.",
                "The human and dog faced a difficult journey through a snowstorm to deliver medicine to a remote village. The dog led the way, and the human's determination kept them going. When they finally arrived, they were hailed as heroes."
            ],
            "human-dog-fantasy": [
                "The human and dog discovered a hidden cave filled with glowing crystals. As they ventured deeper, they found an ancient artifact guarded by a mythical creature. The dog barked bravely, and the human negotiated with the creature, earning its trust and the artifact.",
                "In a magical forest, the human and dog encountered talking animals and enchanted trees. Together, they embarked on a quest to find a legendary flower that could heal any ailment, overcoming challenges and making new friends along the way."
            ],
            "human-dog-adventure": [
                "The human and dog set sail on a small boat, determined to find a hidden treasure rumored to be buried on a remote island. The dog barked excitedly as they approached the shore, and together they dug through the sand to uncover a chest filled with gold and jewels.",
                "In a dense rainforest, the human and dog worked together to find a rare medicinal plant. The dog sniffed out the trail, and the human carefully harvested the plant. Their journey through the wild was filled with challenges, but their teamwork ensured success."
            ]
        };
    }
}
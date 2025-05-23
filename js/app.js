import { EntityManager } from './modules/EntityManager.js';
import { VisualizationManager } from './modules/VisualizationManager.js';
import { UIManager } from './modules/UIManager.js';
import { StorageManager } from './modules/StorageManager.js';

// Menu dropdown logic (moved from index.html)
const menuBtn = document.getElementById('menuBtn');
const menuDropdown = document.getElementById('menuDropdown');
document.addEventListener('click', function(e) {
    if (menuBtn && menuDropdown) {
        if (menuBtn.contains(e.target)) {
            menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
        } else if (!menuDropdown.contains(e.target)) {
            menuDropdown.style.display = 'none';
        }
        if (menuDropdown.style.display === 'block') {
            menuBtn.style.backgrounColor = '#d81b99';
        }else {
            menuBtn.style.backgroundColor = '#d81b60';
        }
    }
});
// Placeholder for LLM settings
if (document.getElementById('llmSettingsLink')) {
    document.getElementById('llmSettingsLink').addEventListener('click', function(e) {
        e.preventDefault();
        menuDropdown.style.display = 'none';
        menuBtn.style.backgroundColor = '#d81b60';
        alert('LLM Model & API Key input coming soon!');
    });
}

class App {
    constructor() {
        this.entityManager = new EntityManager();
        this.visualizationManager = new VisualizationManager();
        this.uiManager = new UIManager();
        this.storageManager = new StorageManager();
        this.draggedEntity = null;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Drag and drop events
        document.querySelectorAll('.entity').forEach(entity => {
            entity.addEventListener('mousedown', () => entity.classList.add('grabbing'));
            entity.addEventListener('mouseup', () => entity.classList.remove('grabbing'));
            entity.addEventListener('dragstart', this.handleDragStart.bind(this));
            entity.addEventListener('dragend', this.handleDragEnd.bind(this));
        });

        const canvas = document.getElementById('canvas');
        canvas.addEventListener('dragenter', this.handleDragEnter.bind(this));
        canvas.addEventListener('dragover', this.handleDragOver.bind(this));
        canvas.addEventListener('dragleave', this.handleDragLeave.bind(this));
        canvas.addEventListener('drop', this.handleDrop.bind(this));

        // Button events
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('saveBtn').addEventListener('click', () => this.save());
        document.getElementById('exportBtn').addEventListener('click', () => this.export());

        // Preset events
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all preset buttons
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                this.loadPreset(e.target.dataset.preset);
            });
        });
        
        // Make all links open in a new tab
        document.querySelectorAll('a.no-style-link').forEach(link => {
        link.setAttribute('target', '_blank');
});
    }

    handleDragStart(e) {
        this.draggedEntity = e.target;
        e.dataTransfer.setData('text/plain', e.target.dataset.entity);
        e.target.classList.add('dragging');
        
        // Create a semi-transparent drag image
        const dragImage = e.target.cloneNode(true);
        dragImage.style.opacity = '0.7';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        
        // Remove the temporary element after a short delay
        setTimeout(() => document.body.removeChild(dragImage), 0);

        // Add dragging class to canvas to show it's a valid drop target
        const canvas = document.getElementById('canvas');
        canvas.classList.add('drag-target');
    }

    handleDragEnd(e) {
        this.draggedEntity = null;
        e.target.classList.remove('dragging');
        
        // Remove dragging class from canvas
        const canvas = document.getElementById('canvas');
        canvas.classList.remove('drag-target');
        canvas.classList.remove('drag-over');
    }

    handleDragEnter(e) {
        if (this.draggedEntity) {
            e.preventDefault();
            e.currentTarget.classList.add('drag-over');
        }
    }

    handleDragOver(e) {
        if (this.draggedEntity) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            e.currentTarget.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        e.currentTarget.classList.remove('drag-target');
        
        const entityType = e.dataTransfer.getData('text/plain');
        if (!entityType) {
            console.error('No entity type data found in drop event');
            return;
        }

        // Calculate drop position relative to the canvas
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create and add the entity
        const entity = this.entityManager.createEntity(entityType, x, y);
        this.visualizationManager.addEntity(entity);
        this.uiManager.updateDimensionControls(entity);

        // Update the action section
        const entities = this.entityManager.getAllEntities();
        this.visualizationManager.updateActionSection(entities);

        // Call compareEntities if there are at least two entities
        if (entities.length >= 2) {
            this.visualizationManager.compareEntities(entities[0], entities[1]);
        }

        // Hide welcome message
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }

        // Update the conversation section
        this.visualizationManager.updateConversationSection(entities);

        // Update the story section
        this.visualizationManager.updateStorySection(entities);

        // Update the thought display text and improvement text color to white
        const thoughtDisplay = document.querySelector('.thought-display');
        if (thoughtDisplay) {
            thoughtDisplay.style.color = '#ffffff'; // Set thought text color to white
        }

        const improvementText = document.querySelector('.improvement-text');
        if (improvementText) {
            improvementText.style.color = '#ffffff'; // Set improvement text color to white
        }
    }

    reset() {
        // Remove active class from all preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        
        this.entityManager.reset();
        this.visualizationManager.reset();
        this.uiManager.reset();

        // Show welcome message
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'block';
        }

        this.visualizationManager.updateActionSection([]); // Hide the action section on reset
        this.visualizationManager.updateConversationSection([]); // Hide the conversation section on reset
        this.visualizationManager.updateStorySection([]); // Hide the story section on reset
    }

    save() {
        const state = this.entityManager.getState();
        this.storageManager.saveState(state);
    }

    export() {
        this.visualizationManager.exportChart();
    }

    loadPreset(presetName) {
        const preset = this.storageManager.getPreset(presetName);
        if (preset) {
            this.reset();
            preset.entities.forEach(entityData => {
                const entity = this.entityManager.createEntity(
                    entityData.type,
                    entityData.x,
                    entityData.y,
                    entityData.dimensions
                );
                this.visualizationManager.addEntity(entity);
                this.uiManager.updateDimensionControls(entity);
            });

            // Update the action section
            const entities = this.entityManager.getAllEntities();
            this.visualizationManager.updateActionSection(entities);

            // Call compareEntities if there are at least two entities
            if (entities.length >= 2) {
                this.visualizationManager.compareEntities(entities[0], entities[1]);
            }

            // Update the conversation section
            this.visualizationManager.updateConversationSection(entities);

            // Update the story section
            this.visualizationManager.updateStorySection(entities);
        } else {
            console.error(`Preset "${presetName}" not found`);
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();

    // Listen button logic for conversation text-to-speech
    const listenBtn = document.getElementById('listenBtn');
    const conversationBox = document.querySelector('.conversation-box');
    let isListening = false;
    let utterance = null;
    let synth = window.speechSynthesis;

    if (listenBtn && conversationBox) {
        listenBtn.addEventListener('click', () => {
            if (!isListening) {
                // Gather all conversation text
                let text = '';
                conversationBox.querySelectorAll('div').forEach(div => {
                    text += div.textContent + '\n';
                });
                if (text.trim().length === 0) return;
                utterance = new window.SpeechSynthesisUtterance(text);
                synth.speak(utterance);
                listenBtn.textContent = 'Stop';
                isListening = true;
                utterance.onend = () => {
                    listenBtn.textContent = 'Listen';
                    isListening = false;
                };
            } else {
                synth.cancel();
                listenBtn.textContent = 'Listen';
                isListening = false;
            }
        });
    }

    // Listen button logic for story text-to-speech
    const listenStoryBtn = document.getElementById('listenStoryBtn');
    const storyBox = document.querySelector('.story-box');
    let isStoryListening = false;
    let storyUtterance = null;

    if (listenStoryBtn && storyBox) {
        listenStoryBtn.addEventListener('click', () => {
            if (!isStoryListening) {
                let text = storyBox.textContent;
                if (text.trim().length === 0) return;
                storyUtterance = new window.SpeechSynthesisUtterance(text);
                synth.speak(storyUtterance);
                listenStoryBtn.textContent = 'Stop';
                isStoryListening = true;
                storyUtterance.onend = () => {
                    listenStoryBtn.textContent = 'Listen';
                    isStoryListening = false;
                };
            } else {
                synth.cancel();
                listenStoryBtn.textContent = 'Listen';
                isStoryListening = false;
            }
        });
    }

    // Paypal
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '3.00' // set your price here
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('Thank you, ' + details.payer.name.given_name + '! Your payment was successful.');

          // Enable the download button
          //const resBtn = document.getElementById('resetBtn');
          //resBtn.disabled = false;
          const savBtn = document.getElementById('saveBtn');
          savBtn.disabled = false;
          const exBtn = document.getElementById('exportBtn');
          exBtn.disabled = false;
        });
      }
    }).render('#paypal-button-container');
    
    // Pay using STRIPE
    const stripeLink = "https://buy.stripe.com/test_4gMcN5bTtf0j833eJk6c000"; // Your Payment Link here

    // On Pay Button Click
    document.getElementById("pay-stripe").addEventListener("click", () => {
      // Redirect to Stripe Checkout
      window.location.href = stripeLink;
    });

    // On Page Load: Check for ?paid=true
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      // Trigger file download (adjust the file path)
      const savBtn = document.getElementById("saveBtn");
      savBtn.disabled = false;
      const exBtn = document.getElementById("exportBtn");
      exBtn.disabled = false;
      // Optional: Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  
});
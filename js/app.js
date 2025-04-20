import { EntityManager } from './modules/EntityManager.js';
import { VisualizationManager } from './modules/VisualizationManager.js';
import { UIManager } from './modules/UIManager.js';
import { StorageManager } from './modules/StorageManager.js';

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
        } else {
            console.error(`Preset "${presetName}" not found`);
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
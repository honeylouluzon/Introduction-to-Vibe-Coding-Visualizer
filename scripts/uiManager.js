import EntityManager from './entityManager.js';

class UIManager {
    constructor() {
        this.entityManager = new EntityManager();
        this.entityManager.updateSidebar(); // Initialize the sidebar
        this.setupEntityManagement();
    }

    setupEntityManagement() {
        const addButton = document.getElementById('add-entity');
        const deleteButton = document.getElementById('delete-entity');

        // Add event listeners for both click and touchstart
        addButton.addEventListener('click', () => {
            const name = prompt('Enter the name of the new entity:');
            if (name) {
                this.entityManager.addEntity(name);
            }
        });

        addButton.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent duplicate events
            const name = prompt('Enter the name of the new entity:');
            if (name) {
                this.entityManager.addEntity(name);
            }
        });

        deleteButton.addEventListener('click', () => {
            this.entityManager.deleteEntity();
        });

        deleteButton.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent duplicate events
            this.entityManager.deleteEntity();
        });
    }
}

export default UIManager;
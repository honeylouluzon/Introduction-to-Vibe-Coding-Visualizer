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

        addButton.addEventListener('click', () => {
            const name = prompt('Enter the name of the new entity:');
            if (name) {
                this.entityManager.addEntity(name);
            }
        });

        deleteButton.addEventListener('click', () => {
            this.entityManager.deleteEntity();
        });
    }
}

export default UIManager;
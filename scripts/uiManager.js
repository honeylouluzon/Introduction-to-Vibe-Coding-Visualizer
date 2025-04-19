import EntityManager from './entityManager.js';

class UIManager {
    constructor() {
        this.entityManager = new EntityManager();
        // ...existing code...
        this.setupEntityManagement();
    }

    setupEntityManagement() {
        const addButton = document.getElementById('add-entity');
        const deleteButton = document.getElementById('delete-entity');
        const updateButton = document.getElementById('update-entity');

        addButton.addEventListener('click', () => {
            const name = prompt('Enter the name of the new entity:');
            if (name) {
                this.entityManager.addEntity(name);
            }
        });

        deleteButton.addEventListener('click', () => {
            const name = prompt('Enter the name of the entity to delete:');
            if (name) {
                this.entityManager.deleteEntity(name);
            }
        });

        updateButton.addEventListener('click', () => {
            const name = prompt('Enter the name of the entity to update:');
            if (name) {
                const dimensions = {};
                ['perception', 'action', 'memory', 'learning', 'goalOrientation'].forEach(dimension => {
                    const value = prompt(`Enter new value for ${dimension} (leave blank to keep current):`);
                    if (value) dimensions[dimension] = parseInt(value, 10);
                });
                this.entityManager.updateEntity(name, dimensions);
            }
        });
    }
}

export default UIManager;
import EntityManager from './entityManager.js';

class UIManager {
    constructor() {
        this.entityManager = new EntityManager();
        // ...existing code...
        this.setupEntityManagement();
    }

    setupEntityManagement() {
        const addButton = document.getElementById('add-entity');
        const editButton = document.getElementById('edit-entity');
        const deleteButton = document.getElementById('delete-entity');

        addButton.addEventListener('click', () => {
            const name = prompt('Enter the name of the new entity:');
            if (name) {
                this.entityManager.addEntity(name);
            }
        });

        editButton.addEventListener('click', () => {
            const name = prompt('Enter the name of the entity to edit:');
            if (name) {
                const dimensions = {};
                ['perception', 'action', 'memory', 'learning', 'goalOrientation'].forEach(dimension => {
                    const value = prompt(`Enter new value for ${dimension} (leave blank to keep current):`);
                    if (value) dimensions[dimension] = parseInt(value, 10);
                });
                this.entityManager.updateEntity(name, dimensions);
            }
        });

        deleteButton.addEventListener('click', () => {
            const name = prompt('Enter the name of the entity to delete:');
            if (name) {
                this.entityManager.deleteEntity(name);
            }
        });
    }
}

export default UIManager;
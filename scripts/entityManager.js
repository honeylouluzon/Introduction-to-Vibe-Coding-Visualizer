class EntityManager {
    constructor() {
        this.entities = [
            { name: 'Human', dimensions: { perception: 80, action: 70, memory: 90, learning: 85, goalOrientation: 95 } },
            { name: 'Dog', dimensions: { perception: 70, action: 80, memory: 60, learning: 50, goalOrientation: 40 } },
            { name: 'AI', dimensions: { perception: 60, action: 50, memory: 95, learning: 90, goalOrientation: 85 } }
        ];
        this.selectedEntity = null; // Track the selected entity
    }

    // Add a new entity
    addEntity(name, dimensions = { perception: 50, action: 50, memory: 50, learning: 50, goalOrientation: 50 }) {
        this.entities.push({ name, dimensions });
        this.updateSidebar();
    }

    // Delete the selected entity
    deleteEntity() {
        if (this.selectedEntity) {
            this.entities = this.entities.filter(entity => entity.name !== this.selectedEntity);
            this.selectedEntity = null; // Clear the selection
            this.updateSidebar();
        } else {
            alert('Please select an entity to delete.');
        }
    }

    // Update the sidebar with the current list of entities
    updateSidebar() {
        const sidebar = document.getElementById('entity-list');
        sidebar.innerHTML = ''; // Clear existing entities
        this.entities.forEach(entity => {
            const entityElement = document.createElement('div');
            entityElement.className = 'entity';
            entityElement.textContent = entity.name;
            entityElement.draggable = true;

            // Add click event to select the entity
            entityElement.addEventListener('click', () => {
                this.selectedEntity = entity.name;
                document.querySelectorAll('.entity').forEach(el => el.classList.remove('selected'));
                entityElement.classList.add('selected');
            });

            sidebar.appendChild(entityElement);
        });
    }
}

export default EntityManager;
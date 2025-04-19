class EntityManager {
    constructor() {
        this.entities = [
            { name: 'Human', dimensions: { perception: 80, action: 70, memory: 90, learning: 85, goalOrientation: 95 } },
            { name: 'Dog', dimensions: { perception: 70, action: 80, memory: 60, learning: 50, goalOrientation: 40 } },
            { name: 'AI', dimensions: { perception: 60, action: 50, memory: 95, learning: 90, goalOrientation: 85 } }
        ];
    }

    // Add a new entity
    addEntity(name, dimensions = { perception: 50, action: 50, memory: 50, learning: 50, goalOrientation: 50 }) {
        this.entities.push({ name, dimensions });
        this.updateSidebar();
    }

    // Delete an existing entity
    deleteEntity(name) {
        this.entities = this.entities.filter(entity => entity.name !== name);
        this.updateSidebar();
    }

    // Update an existing entity
    updateEntity(name, newDimensions) {
        const entity = this.entities.find(entity => entity.name === name);
        if (entity) {
            entity.dimensions = { ...entity.dimensions, ...newDimensions };
            this.updateSidebar();
        }
    }

    // Update the sidebar with the current list of entities
    updateSidebar() {
        const sidebar = document.getElementById('entity-sidebar');
        sidebar.innerHTML = ''; // Clear existing entities
        this.entities.forEach(entity => {
            const entityElement = document.createElement('div');
            entityElement.className = 'entity';
            entityElement.textContent = entity.name;
            entityElement.draggable = true;
            sidebar.appendChild(entityElement);
        });
    }
}

export default EntityManager;
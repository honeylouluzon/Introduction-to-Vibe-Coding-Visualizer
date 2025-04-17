export class EntityManager {
    constructor() {
        this.entities = new Map();
        this.nextId = 1;
    }

    createEntity(type, x, y, dimensions = null) {
        const id = this.nextId++;
        const entity = {
            id,
            type,
            x,
            y,
            dimensions: dimensions || this.getDefaultDimensions(type)
        };
        this.entities.set(id, entity);
        return entity;
    }

    getDefaultDimensions(type) {
        // Default dimension values for different entity types
        const defaults = {
            human: {
                perception: 80,
                action: 70,
                memory: 85,
                learning: 90,
                goalOrientation: 95
            },
            dog: {
                perception: 85,
                action: 90,
                memory: 60,
                learning: 70,
                goalOrientation: 75
            },
            ai: {
                perception: 95,
                action: 40,
                memory: 100,
                learning: 100,
                goalOrientation: 85
            }
        };
        return defaults[type] || {
            perception: 50,
            action: 50,
            memory: 50,
            learning: 50,
            goalOrientation: 50
        };
    }

    updateEntityDimensions(id, dimensions) {
        const entity = this.entities.get(id);
        if (entity) {
            entity.dimensions = { ...entity.dimensions, ...dimensions };
            return true;
        }
        return false;
    }

    updateEntityPosition(id, x, y) {
        const entity = this.entities.get(id);
        if (entity) {
            entity.x = x;
            entity.y = y;
            return true;
        }
        return false;
    }

    removeEntity(id) {
        return this.entities.delete(id);
    }

    getEntity(id) {
        return this.entities.get(id);
    }

    getAllEntities() {
        return Array.from(this.entities.values());
    }

    getState() {
        return {
            entities: this.getAllEntities()
        };
    }

    reset() {
        this.entities.clear();
        this.nextId = 1;
    }
} 
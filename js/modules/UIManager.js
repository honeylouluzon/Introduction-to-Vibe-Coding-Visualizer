export class UIManager {
    constructor() {
        this.dimensionControls = document.getElementById('dimensionControls');
        this.welcomeMessage = document.querySelector('.welcome-message');
    }

    updateDimensionControls(entity) {
        // Hide welcome message when entities are added
        if (this.welcomeMessage) {
            this.welcomeMessage.style.display = 'none';
        }

        // Create dimension controls container for the entity
        const container = document.createElement('div');
        container.className = 'entity-controls';
        container.dataset.entityId = entity.id;

        // Add entity label
        const label = document.createElement('h3');
        label.textContent = this.getEntityLabel(entity.type);
        container.appendChild(label);

        // Create sliders for each dimension
        const dimensions = ['perception', 'action', 'memory', 'learning', 'goalOrientation'];
        dimensions.forEach(dimension => {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'dimension-slider';

            const label = document.createElement('label');
            label.textContent = this.formatDimensionLabel(dimension);
            label.htmlFor = `${entity.id}-${dimension}`;

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = `${entity.id}-${dimension}`;
            slider.min = '0';
            slider.max = '100';
            slider.step = '1';
            slider.value = entity.dimensions[dimension];
            slider.setAttribute('aria-label', this.formatDimensionLabel(dimension));
            slider.setAttribute('aria-valuemin', '0');
            slider.setAttribute('aria-valuemax', '100');
            slider.setAttribute('aria-valuenow', entity.dimensions[dimension]);

            const value = document.createElement('span');
            value.className = 'dimension-value';
            value.textContent = entity.dimensions[dimension];

            slider.addEventListener('input', (e) => {
                const newValue = parseInt(e.target.value);
                value.textContent = newValue;
                window.app.entityManager.updateEntityDimensions(entity.id, {
                    [dimension]: newValue
                });
                window.app.visualizationManager.updateEntity(entity);

                // Update comparison result if there are at least two entities
                const entities = window.app.entityManager.getAllEntities();
                if (entities.length >= 2) {
                    window.app.visualizationManager.compareEntities(entities[0], entities[1]);
                }
            });

            sliderContainer.appendChild(label);
            sliderContainer.appendChild(slider);
            sliderContainer.appendChild(value);
            container.appendChild(sliderContainer);
        });

        this.dimensionControls.appendChild(container);
    }

    removeEntityControls(entityId) {
        const controls = this.dimensionControls.querySelector(`[data-entity-id="${entityId}"]`);
        if (controls) {
            controls.remove();
        }

        // Show welcome message if no entities are present
        if (this.dimensionControls.children.length === 0 && this.welcomeMessage) {
            this.welcomeMessage.style.display = 'block';
        }
    }

    getEntityLabel(type) {
        const labels = {
            human: 'Human',
            dog: 'Dog',
            ai: 'AI Bot'
        };
        return labels[type] || type;
    }

    formatDimensionLabel(dimension) {
        const labels = {
            perception: 'Perception',
            action: 'Action',
            memory: 'Memory',
            learning: 'Learning',
            goalOrientation: 'Goal Orientation'
        };
        return labels[dimension] || dimension;
    }

    reset() {
        this.dimensionControls.innerHTML = '';
        if (this.welcomeMessage) {
            this.welcomeMessage.style.display = 'block';
        }
    }
}
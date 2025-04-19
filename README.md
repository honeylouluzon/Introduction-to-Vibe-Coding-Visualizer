# Consciousness Continuum Visualizer

A client-side web application for comparing different entities (humans, animals, and artificial intelligences) across five key intelligence dimensions: Perception, Action, Memory, Learning, and Goal Orientation.

## Features

- Drag and drop interface for adding entities to the visualization
- Interactive sliders to adjust intelligence dimensions
- Real-time radar chart visualization
- Preset configurations for quick comparisons
- Save and load custom configurations
- Export visualizations as images
- Fully responsive design
- Accessibility support
- **Entity Management**: Add, delete, or update available entities for drag-and-drop comparison

## Getting Started

1. Clone this repository
2. Open `index.html` in a modern web browser
3. Start dragging entities from the sidebar to the canvas
4. Use the sliders to adjust the intelligence dimensions
5. Try the preset configurations for quick comparisons

## Usage

### Adding Entities
- Drag entities from the sidebar onto the canvas
- Each entity will appear in the visualization with default dimension values

### Adjusting Dimensions
- Use the sliders in the control panel to adjust each dimension
- Changes are reflected in real-time in the visualization

### Presets
- Click on preset buttons to load predefined configurations
- Compare different entities with optimized dimension values

### Saving and Loading
- Click the "Save" button to save your current configuration
- Enter a name for your configuration when prompted
- Use the "Reset" button to clear the canvas and start over

### Exporting
- Click the "Export" button to save the current visualization as a PNG image

### Managing Entities
- Use the "Manage Entities" panel to add, delete, or update entities.
- When adding a new entity, default reasonable values for its dimensions will be auto-set.
- Updated or newly added entities will immediately become available for drag-and-drop.
- Deleted entities will no longer appear in the sidebar.

## Technical Details

- Built with vanilla JavaScript (ES6+)
- Uses Chart.js for visualizations
- Implements HTML5 Drag and Drop API
- Uses LocalStorage for saving configurations
- Follows WCAG 2.1 Level AA accessibility guidelines

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

The application is structured into several modules:

- `EntityManager`: Handles entity creation and management
- `VisualizationManager`: Manages the chart visualization
- `UIManager`: Controls UI elements and interactions
- `StorageManager`: Handles local storage and presets

## License

MIT License
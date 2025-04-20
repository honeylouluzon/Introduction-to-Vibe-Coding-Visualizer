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

- Entities are predefined and available for drag-and-drop comparison.
- The application no longer supports adding or deleting entities dynamically.

### Consciousness Score and Comparison

- Each entity has a total consciousness score calculated by summing up its five intelligence dimensions: Perception, Action, Memory, Learning, and Goal Orientation.
- When two entities are compared, their total scores are displayed below the chart in a formatted result.
- The result highlights which entity is more conscious or if both entities are equally conscious.

### Example

- **Human**: Total Score = 420
- **AI Bot**: Total Score = 380
- Result: "Human is more conscious with a total score of 420. AI Bot has a total score of 380."

### Action Section

- After dragging entities to the canvas or selecting a preset, you can select one entity to perform an action.
- Use the radio buttons to select the entity. The labels correspond to the names of the dragged entities.
- Below the selection, there are six action buttons: "Reading", "Chatting", "Traveling", "Exercising", "Meditating", and "Cooking".
- Clicking an action button will:
  - Modify the selected entity's dimensions based on the action.
  - Update the radar chart, sliders (existing sliders will move to reflect the changes), and comparison result.
  - Display a random thought related to the action below the chart for 20 seconds. The thought will be enclosed in quotation marks and specify which entity is thinking or saying it (e.g., "Human is thinking: 'The view is so nice, nature is relaxing.'").
  - Append the dimension improvements (e.g., "Improvement: +5 memory, +5 perception") under the thought. The word "Improvement" is underlined for emphasis.

### Example

- **Action**: Traveling
- **Thought**: "Human is thinking: 'The view is so nice, nature is relaxing, I like the sea breeze and the feeling of the sand touching my feet.'"
- **Improvement**: "+10 perception, +5 goal orientation"

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
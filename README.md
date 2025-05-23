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
- **Listen Button**: Listen to the conversation and story text using text-to-speech. Toggle to stop playback.
- **Menu Button**: Hamburger-style button below the main title, before the entities section, opening a dropdown menu.
- **Menu Dropdown**: Includes links to LLM Model & API Key settings, Privacy Policy, and Terms of Use pages.
- **LLM Model & API Key Modal**: Select from available LLM models and input your API key. Modal theme matches the page theme.
- **Privacy Policy and Terms Pages**: Accessible from the menu, displaying content from PrivacyPolicy.md and Terms.md.

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

### Listen Button

- A "Listen" button is available below the conversation text box and under the "Our Story Together" text box.
- Clicking the button will read aloud the text in the respective box using your browser's text-to-speech engine.
- Clicking again will stop the audio.

### Menu Button and Dropdown

- A hamburger-style "Menu" button is located below the main title and before the entities section.
- Clicking the button opens a dropdown menu with the following items:
  - **LLM Model & API Key**: Opens a modal to select the LLM model and input your API key.
  - **Privacy Policy**: Opens the Privacy Policy page (from PrivacyPolicy.md).
  - **Terms of Use**: Opens the Terms of Use page (from Terms.md).

### LLM Model & API Key Modal

- Accessible from the menu dropdown.
- Allows you to select from available LLM models (e.g., GPT-4o, GPT-3.5 Turbo, Llama 3, Mixtral 8x7B, or Custom).
- Provides a field to input your LLM API key.
- Modal theme matches the overall page theme.

### Privacy Policy and Terms Pages

- Privacy Policy and Terms of Use are available as separate markdown files and accessible from the menu dropdown.
- Clicking the links opens the respective documents in a new tab.

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

### Conversation Section

- After dragging at least two entities to the canvas or selecting a preset, the "Conversation" section will appear.
- This section simulates an automated conversation between the selected entities.
- The conversation is based on the entities' consciousness scores and dimensions.
- Each entity will:
  - Ask questions related to its highest dimension or consciousness score.
  - Respond to the other entity's question based on its own dimensions and consciousness score.
  - Randomly ask a follow-up question after answering, keeping the conversation dynamic.
- The conversation alternates between the entities, ensuring that one entity answers before asking its own question.
- The conversation flows continuously in a chat box with a fixed size and a scroll bar to view previous messages.
- The format of the conversation is:
  - **Entity Name**: Question or Answer
- Example:
  - **Human**: "What do you see around you?"
  - **AI Bot**: "I see a beautiful landscape."
  - **AI Bot**: "What motivates you to take action?"
  - **Human**: "I enjoy taking on new challenges."

### Example

- **Conversation**:
  - **Human**: "What is your favorite memory?"
  - **AI Bot**: "I remember my first interaction with humans. It was fascinating."
  - **Human**: "What motivates you to take action?"
  - **AI Bot**: "I enjoy taking on new challenges and learning from them."
  - **AI Bot**: "What have you learned recently?"
  - **Human**: "I recently learned about quantum physics. It's fascinating."

### Our Story Together

- After dragging at least two entities to the canvas or selecting a preset, the "Our Story Together" section will appear.
- This section generates a story based on:
  - The selected entities.
  - The type of story chosen (Love, Horror, Comedy, Drama, Fantasy, or Adventure).
  - The dimensions and consciousness scores of the entities.
- Use the radio buttons to select the type of story. The radio buttons are arranged in 3 columns by 2 rows for better usability.
- The story is dynamically refreshed whenever:
  - The dimensions of the entities change.
  - The selected entities are updated.
  - The story type is changed using the radio buttons.
- The story dataset includes:
  - **Entity Combinations**: AI-Human, AI-Dog, Human-Dog.
  - **Story Types**: Love, Horror, Comedy, Drama, Fantasy, and Adventure.
  - **Consciousness Score Ranges**: 0-150, 151-300, 301-450, 451-500.
- Each combination of entity pair, story type, and consciousness score range has at least two unique stories, each at least two paragraphs long.
- Example:
  - **Story Type**: Love
  - **Story**: "Once upon a time, a human and an AI discovered a shared passion for art. Together, they created masterpieces that inspired the world."

### Combine Together

- When at least two entities are added to the canvas, the "Combine Together" section will appear below the comparison result.
- This section displays the possible entity that could be created when the two selected entities are combined.
- The result is based on the combined consciousness scores of the two entities:
  - **0-200**: Represents a basic or limited combination.
  - **201-400**: Represents a moderately advanced combination.
  - **401-500**: Represents a highly advanced or extraordinary combination.
- The description of the combined entity includes its capabilities and appearance.
- Example combinations:
  - **AI and Human**:
    - **0-200**: "A basic humanoid robot with limited memory but capable of simple tasks."
    - **201-400**: "An intelligent humanoid with high memory that looks human outside but powered by AI inside."
    - **401-500**: "A super-intelligent being with human-like emotions and AI precision, capable of solving complex problems."
  - **AI and Dog**:
    - **0-200**: "A robotic dog with basic AI that can follow simple commands."
    - **201-400**: "A cybernetic canine with advanced AI, capable of assisting in search and rescue missions."
    - **401-500**: "A futuristic hybrid with the agility of a dog and the intelligence of AI, capable of independent decision-making."
  - **Human and Dog**:
    - **0-200**: "A playful creature with a dog's instincts and a human's curiosity."
    - **201-400**: "A half-dog above and a human below, good at logic and reasoning but with limited memory."
    - **401-500**: "A mythical being with the loyalty of a dog and the intellect of a human, capable of extraordinary feats."

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
- `llm.js`: Handles LLM model selection and API key input, and provides utility functions for LLM and image generation

## License

MIT License
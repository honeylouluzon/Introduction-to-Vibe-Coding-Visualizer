# Introduction to Vibe Coding Visualizer

A web application for visualizing and comparing the intelligence dimensions of different entities (Human, Dog, AI Bot) using interactive charts, sliders, and AI-generated stories.

[**Live Demo**](https://honeylouluzon.github.io/Introduction-to-Vibe-Coding-Visualizer/)

---

## Features

### 1. Entity Management & Visualization
- **Drag-and-drop** entities (Human, Dog, AI Bot) onto the canvas.
- **Adjust intelligence dimensions** (Perception, Action, Memory, Learning, Goal Orientation) using sliders.
- **Radar chart** updates in real time to reflect changes.
- **Preset buttons** for quick configuration.
- **Export** the current chart as a PNG image.
- **Save/Load** custom configurations using LocalStorage.

### 2. Menu & Navigation
- **Hamburger Menu Button** below the main title, styled to match preset buttons.
- **Dropdown Menu** includes:
  - <span style="color:#fff;">Large Language Model</span>
  - <span style="color:#fff;">Privacy Policy</span>
  - <span style="color:#fff;">Terms of Use</span>
  - <span style="color:#fff;">Documentation</span>

### 3. LLM Model & API Key Modal
- **Accessible from the menu**.
- **Model selection**: Choose from OpenAI, Llama, DeepSeek, Mistral, or Custom (No API Needed).
- **API Key input**: Only visible for non-Custom models. Hidden and cleared for Custom.
- **Theme**: Modal matches the overall page theme.
- **Settings are saved** in LocalStorage for use in story generation.

### 4. Privacy Policy & Terms Pages
- **Accessible from the menu**.
- **Content loaded** from `PrivacyPolicy.md` and `Terms.md`.
- **Open in a new tab** for easy reference.

### 5. Listen Button (Text-to-Speech)
- **Below the conversation box** and **under the story box**.
- **Click to listen** to the text in the respective box.
- **Click again to stop** playback.

### 6. Action Section
- **Radio buttons** to select an entity.
- **Action buttons**: Reading, Chatting, Traveling, Exercising, Meditating, Cooking.
- **Effects**: Each action modifies the selected entity's dimensions and updates the chart, sliders, and comparison.
- **Thought display**: Shows a random thought and improvement summary for 20 seconds after an action.

### 7. Comparison & Combine Section
- **Comparison result**: Shows which entity is more conscious based on total score.
- **Combine Together**: Displays a description of the combined entity based on the sum of their scores and types.

### 8. Conversation Section
- **Appears when two or more entities are present**.
- **Automated conversation**: Entities ask and answer questions based on their highest dimension.
- **Chat box**: Scrollable, with each message labeled by entity.

### 9. Our Story Together
- **Appears when two or more entities are present**.
- **Story type selection**: Love, Horror, Comedy, Drama, Fantasy, Adventure (radio buttons, 3x2 grid).
- **Story generation**: Based on selected entities, their dimensions, and story type.
- **Story updates** when dimensions or story type change.

---

## LLM Model Integration Logic

- **Default/Custom**: If no model is selected or "Custom" is chosen, the app uses `llm.js` for story generation (no API key required).
- **Other Models**: If a supported model is selected and an API key is provided, the app uses `llm-integration.js` to generate stories via the selected model and key.
- **Automatic Fallback**: If the model or API key is cleared, the app falls back to the default `llm.js`.
- **Separate integration files**: Each LLM integration (OpenAI, Llama, DeepSeek, Mistral, etc.) is handled in its own JS file.

---

## Usage Guide

### Adding Entities
- Drag from the sidebar to the canvas.
- Each entity appears with default dimension values.

### Adjusting Dimensions
- Use sliders to change Perception, Action, Memory, Learning, Goal Orientation.
- Chart updates instantly.

### Presets
- Click a preset button to load a predefined configuration.

### Saving & Loading
- Click "Save" to store your configuration (uses LocalStorage).
- Click "Reset" to clear the canvas and start over.

### Exporting
- Click "Export" to save the current chart as a PNG image.

### Action Section
- Select an entity and click an action button.
- See the thought and improvement summary below the chart.

### Comparison & Combine
- When two entities are present, their scores are compared and the result is shown.
- The "Combine Together" section describes the possible hybrid entity.

### Conversation
- When two or more entities are present, the conversation section appears.
- Entities take turns asking and answering questions based on their highest dimension.

### Our Story Together
- When two or more entities are present, the story section appears.
- Select a story type and see a story generated based on the entities and their dimensions.

---

## Technical Details
- **Vanilla JavaScript (ES6+)**
- **Chart.js** for radar chart visualization
- **HTML5 Drag and Drop API**
- **LocalStorage** for saving configurations
- **WCAG 2.1 Level AA** accessibility

### Modules
- `EntityManager.js`: Entity creation and management
- `VisualizationManager.js`: Chart and visualization logic
- `UIManager.js`: UI controls and updates
- `StorageManager.js`: Saving/loading state and presets
- `llm.js`: Default LLM logic
- `llm-integration.js` and others: API-based LLM integrations

---

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## License
MIT License
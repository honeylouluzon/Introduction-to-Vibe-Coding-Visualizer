export class StorageManager {
    constructor() {
        this.storageKey = 'consciousnessContinuum';
        this.initializePresets();
    }

    initializePresets() {
        const defaultPresets = {
            'human-vs-dog': {
                name: 'Human vs Dog',
                entities: [
                    {
                        type: 'human',
                        x: 100,
                        y: 100,
                        dimensions: {
                            perception: 80,
                            action: 70,
                            memory: 85,
                            learning: 90,
                            goalOrientation: 95
                        }
                    },
                    {
                        type: 'dog',
                        x: 300,
                        y: 100,
                        dimensions: {
                            perception: 85,
                            action: 90,
                            memory: 60,
                            learning: 70,
                            goalOrientation: 75
                        }
                    }
                ]
            },
            'ai-comparison': {
                name: 'AI Comparison',
                entities: [
                    {
                        type: 'ai',
                        x: 100,
                        y: 100,
                        dimensions: {
                            perception: 95,
                            action: 40,
                            memory: 100,
                            learning: 100,
                            goalOrientation: 85
                        }
                    },
                    {
                        type: 'human',
                        x: 300,
                        y: 100,
                        dimensions: {
                            perception: 80,
                            action: 70,
                            memory: 85,
                            learning: 90,
                            goalOrientation: 95
                        }
                    }
                ]
            }
        };

        // Store default presets if they don't exist
        if (!localStorage.getItem(this.storageKey + '_presets')) {
            localStorage.setItem(this.storageKey + '_presets', JSON.stringify(defaultPresets));
        }
    }

    saveState(state) {
        try {
            const name = prompt('Enter a name for this configuration:');
            if (name) {
                const savedStates = this.getSavedStates();
                savedStates[name] = state;
                localStorage.setItem(this.storageKey + '_states', JSON.stringify(savedStates));
                alert('Configuration saved successfully!');
            }
        } catch (error) {
            console.error('Error saving state:', error);
            alert('Error saving configuration. Please try again.');
        }
    }

    getSavedStates() {
        try {
            const states = localStorage.getItem(this.storageKey + '_states');
            return states ? JSON.parse(states) : {};
        } catch (error) {
            console.error('Error getting saved states:', error);
            return {};
        }
    }

    getPreset(presetName) {
        try {
            const presets = JSON.parse(localStorage.getItem(this.storageKey + '_presets'));
            return presets[presetName];
        } catch (error) {
            console.error('Error getting preset:', error);
            return null;
        }
    }

    getAllPresets() {
        try {
            const presets = JSON.parse(localStorage.getItem(this.storageKey + '_presets'));
            return presets || {};
        } catch (error) {
            console.error('Error getting all presets:', error);
            return {};
        }
    }

    clearSavedStates() {
        try {
            localStorage.removeItem(this.storageKey + '_states');
        } catch (error) {
            console.error('Error clearing saved states:', error);
        }
    }
} 
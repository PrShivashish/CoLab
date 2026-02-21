// AI Settings Storage - Manage user preferences for AI features

const AI_SETTINGS_KEY = 'colab_ai_settings';

const defaultSettings = {
    autocomplete: false, // OFF by default - user opt-in
    autoAnalyze: false,
    debugAssist: true,  // Helpful, so ON by default
    preferredModel: 'flash',
    chatHistory: [],
};

class AISettings {
    constructor() {
        this.settings = this.load();
    }

    /**
     * Load settings from localStorage
     */
    load() {
        try {
            const stored = localStorage.getItem(AI_SETTINGS_KEY);
            if (stored) {
                return { ...defaultSettings, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.error('Failed to load AI settings:', error);
        }
        return { ...defaultSettings };
    }

    /**
     * Save settings to localStorage
     */
    save() {
        try {
            localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(this.settings));
        } catch (error) {
            console.error('Failed to save AI settings:', error);
        }
    }

    /**
     * Get a setting value
     */
    get(key) {
        return this.settings[key];
    }

    /**
     * Set a setting value
     */
    set(key, value) {
        this.settings[key] = value;
        this.save();
    }

    /**
     * Toggle a boolean setting
     */
    toggle(key) {
        this.settings[key] = !this.settings[key];
        this.save();
        return this.settings[key];
    }

    /**
     * Get all settings
     */
    getAll() {
        return { ...this.settings };
    }

    /**
     * Reset to default settings
     */
    reset() {
        this.settings = { ...defaultSettings };
        this.save();
    }

    /**
     * Add chat message to history
     */
    addChatMessage(message, response) {
        if (!this.settings.chatHistory) {
            this.settings.chatHistory = [];
        }

        this.settings.chatHistory.push({
            timestamp: new Date().toISOString(),
            message,
            response,
        });

        // Keep only last 50 messages
        if (this.settings.chatHistory.length > 50) {
            this.settings.chatHistory = this.settings.chatHistory.slice(-50);
        }

        this.save();
    }

    /**
     * Clear chat history
     */
    clearChatHistory() {
        this.settings.chatHistory = [];
        this.save();
    }
}

export default new AISettings();

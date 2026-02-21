// AI Service - Frontend client for Gemini AI features

const AI_API_BASE = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/ai`;

class AIService {
    /**
     * Get code autocomplete suggestion
     */
    async getAutocompletion(code, cursorPosition, language, filename = 'script') {
        try {
            const response = await fetch(`${AI_API_BASE}/autocomplete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    cursorPosition,
                    language,
                    filename,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get completion');
            }

            return await response.json();
        } catch (error) {
            console.error('Autocomplete error:', error);
            throw error;
        }
    }

    /**
     * Analyze code for errors and improvements
     */
    async analyzeCode(code, language) {
        try {
            const response = await fetch(`${AI_API_BASE}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to analyze code');
            }

            return await response.json();
        } catch (error) {
            console.error('Analysis error:', error);
            throw error;
        }
    }

    /**
     * Generate code from description
     */
    async generateCode(description, language, context = {}) {
        try {
            const response = await fetch(`${AI_API_BASE}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    language,
                    context,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate code');
            }

            return await response.json();
        } catch (error) {
            console.error('Generation error:', error);
            throw error;
        }
    }

    /**
     * Get debugging help for error
     */
    async getDebugHelp(errorMessage, code, language, stackTrace = '') {
        try {
            const response = await fetch(`${AI_API_BASE}/debug`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: errorMessage,
                    code,
                    language,
                    stackTrace,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to get debug help');
            }

            return await response.json();
        } catch (error) {
            console.error('Debug error:', error);
            throw error;
        }
    }

    /**
     * Chat with AI assistant
     */
    async chat(message, context = {}) {
        try {
            const response = await fetch(`${AI_API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    context,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to process chat');
            }

            return await response.json();
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    }

    /**
     * Check rate limit remaining
     */
    getQuotaFromHeaders(response) {
        return {
            remainingMinute: parseInt(response.headers.get('X-RateLimit-Remaining-Minute')) || 0,
            remainingDaily: parseInt(response.headers.get('X-RateLimit-Remaining-Daily')) || 0,
        };
    }
}

export default new AIService();

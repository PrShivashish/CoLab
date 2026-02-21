import { useState, useEffect, useRef } from 'react';
import aiService from '../services/aiService';
import aiSettings from '../utils/aiStorage';

/**
 * Hook for AI autocomplete functionality
 * Handles debouncing, API calls, and suggestion display
 */
export function useAIAutocomplete(code, cursorPosition, language, enabled) {
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const debounceTimer = useRef(null);
    const lastRequest = useRef(null);

    useEffect(() => {
        // Clear suggestion if autocomplete is disabled
        if (!enabled) {
            setSuggestion(null);
            return;
        }

        // Skip if no code or position
        if (!code || cursorPosition === undefined || !language) {
            return;
        }

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Debounce autocomplete requests
        debounceTimer.current = setTimeout(async () => {
            const requestId = `${code.length}-${cursorPosition}-${language}`;

            // Skip if same request
            if (requestId === lastRequest.current) {
                return;
            }

            lastRequest.current = requestId;
            setLoading(true);

            try {
                const result = await aiService.getAutocompletion(
                    code,
                    cursorPosition,
                    language
                );

                if (result.success && result.suggestion) {
                    setSuggestion({
                        text: result.suggestion,
                        confidence: result.confidence || 0.8,
                    });
                } else {
                    setSuggestion(null);
                }
            } catch (error) {
                console.error('Autocomplete request failed:', error);
                setSuggestion(null);

                // If error is rate limit, disable temporarily
                if (error.message?.includes('Rate limit')) {
                    // Could show a toast notification here
                    console.warn('AI autocomplete rate limited');
                }
            } finally {
                setLoading(false);
            }
        }, 500); // 500ms debounce

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [code, cursorPosition, language, enabled]);

    const acceptSuggestion = () => {
        if (suggestion) {
            const accepted = suggestion.text;
            setSuggestion(null);
            return accepted;
        }
        return null;
    };

    const dismissSuggestion = () => {
        setSuggestion(null);
    };

    return {
        suggestion,
        loading,
        acceptSuggestion,
        dismissSuggestion,
    };
}

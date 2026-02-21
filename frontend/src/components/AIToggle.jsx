import { useState, useEffect } from 'react';
import { Zap, ZapOff } from 'lucide-react';
import aiSettings from '../utils/aiStorage';

/**
 * AI Toggle Button - Enable/disable AI autocomplete
 */
export default function AIToggle({ className = '' }) {
    const [enabled, setEnabled] = useState(false);

    // Load initial state from settings
    useEffect(() => {
        setEnabled(aiSettings.get('autocomplete'));
    }, []);

    const handleToggle = () => {
        const newState = aiSettings.toggle('autocomplete');
        setEnabled(newState);
    };

    return (
        <button
            onClick={handleToggle}
            className={`ai-toggle ${enabled ? 'active' : ''} ${className}`}
            title={`AI Autocomplete: ${enabled ? 'ON' : 'OFF'} (Ctrl+Shift+A)`}
            aria-label="Toggle AI Autocomplete"
        >
            {enabled ? (
                <>
                    <Zap className="icon" size={18} />
                    <span className="label">AI ON</span>
                </>
            ) : (
                <>
                    <ZapOff className="icon" size={18} />
                    <span className="label">AI OFF</span>
                </>
            )}
        </button>
    );
}

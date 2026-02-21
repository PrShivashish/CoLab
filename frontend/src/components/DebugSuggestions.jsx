import { Bug, Lightbulb, X } from 'lucide-react';

/**
 * Debug Suggestions - Display AI debugging help
 */
export default function DebugSuggestions({ debugHelp, onClose }) {
    if (!debugHelp) return null;

    return (
        <div className="debug-suggestions-panel">
            <div className="debug-header">
                <div className="title">
                    <Bug size={20} />
                    <span>AI Debug Assistant</span>
                </div>
                <button onClick={onClose} className="close-btn" aria-label="Close debug help">
                    <X size={18} />
                </button>
            </div>

            <div className="debug-content">
                <div className="debug-analysis">
                    <Lightbulb size={24} className="lightbulb-icon" />
                    <div className="analysis-text">
                        {debugHelp.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

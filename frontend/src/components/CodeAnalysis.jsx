import { useState } from 'react';
import { AlertCircle, Info, AlertTriangle, Lightbulb, X } from 'lucide-react';

/**
 * Code Analysis Display - Show AI analysis results
 */
export default function CodeAnalysis({ analysis, onClose }) {
    const [expandedItems, setExpandedItems] = useState(new Set());

    if (!analysis) return null;

    const { errors = [], score = 0 } = analysis;

    const toggleExpand = (index) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedItems(newExpanded);
    };

    const getIcon = (severity) => {
        switch (severity) {
            case 'error':
                return <AlertCircle size={18} className="error-icon" />;
            case 'warning':
                return <AlertTriangle size={18} className="warning-icon" />;
            case 'info':
                return <Info size={18} className="info-icon" />;
            default:
                return <Lightbulb size={18} className="suggestion-icon" />;
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'good';
        if (score >= 60) return 'okay';
        return 'poor';
    };

    return (
        <div className="code-analysis-panel">
            <div className="analysis-header">
                <div className="title">
                    <Lightbulb size={20} />
                    <span>Code Analysis</span>
                </div>
                <div className={`score ${getScoreColor(score)}`}>
                    Score: {score}/100
                </div>
                <button onClick={onClose} className="close-btn" aria-label="Close analysis">
                    <X size={18} />
                </button>
            </div>

            <div className="analysis-content">
                {errors.length === 0 ? (
                    <div className="no-issues">
                        <Lightbulb size={32} />
                        <p>No issues found! Your code looks great.</p>
                    </div>
                ) : (
                    <div className="issues-list">
                        {errors.map((error, index) => (
                            <div key={index} className={`issue-item severity-${error.severity}`}>
                                <div className="issue-header" onClick={() => toggleExpand(index)}>
                                    {getIcon(error.severity)}
                                    <div className="issue-info">
                                        <div className="issue-message">{error.message}</div>
                                        {error.line > 0 && (
                                            <div className="issue-location">Line {error.line}</div>
                                        )}
                                    </div>
                                    <div className="issue-type">{error.type}</div>
                                </div>

                                {expandedItems.has(index) && error.suggestion && (
                                    <div className="issue-details">
                                        <div className="suggestion">
                                            <strong>Suggested Fix:</strong>
                                            <p>{error.suggestion}</p>
                                        </div>
                                        {error.confidence < 0.7 && (
                                            <div className="confidence-warning">
                                                <Info size={14} />
                                                <span>Low confidence ({Math.round(error.confidence * 100)}%)</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

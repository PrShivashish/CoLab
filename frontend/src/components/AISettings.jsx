import { useState } from 'react';
import { Settings, X, Zap, AlertCircle, Bug, Sparkles } from 'lucide-react';
import aiSettings from '../utils/aiStorage';

/**
 * AI Settings Panel - Configure AI preferences
 */
export default function AISettings({ isOpen, onClose }) {
    const [settings, setSettings] = useState(aiSettings.getAll());

    const handleToggle = (key) => {
        aiSettings.toggle(key);
        setSettings(aiSettings.getAll());
    };

    const handleClearHistory = () => {
        if (confirm('Clear all chat history?')) {
            aiSettings.clearChatHistory();
            setSettings(aiSettings.getAll());
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ai-settings-panel">
            <div className="settings-header">
                <div className="title">
                    <Settings size={20} />
                    <span>AI Settings</span>
                </div>
                <button onClick={onClose} className="close-btn" aria-label="Close settings">
                    <X size={20} />
                </button>
            </div>

            <div className="settings-content">
                <div className="setting-group">
                    <h3>Features</h3>

                    <div className="setting-item">
                        <div className="setting-info">
                            <Zap size={18} />
                            <div>
                                <div className="setting-name">Smart Autocomplete</div>
                                <div className="setting-desc">AI-powered code completions</div>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.autocomplete}
                                onChange={() => handleToggle('autocomplete')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <AlertCircle size={18} />
                            <div>
                                <div className="setting-name">Auto-Analyze</div>
                                <div className="setting-desc">Automatically check code for errors</div>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.autoAnalyze}
                                onChange={() => handleToggle('autoAnalyze')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <Bug size={18} />
                            <div>
                                <div className="setting-name">Debug Assist</div>
                                <div className="setting-desc">AI help when code fails to run</div>
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.debugAssist}
                                onChange={() => handleToggle('debugAssist')}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>

                <div className="setting-group">
                    <h3>Data</h3>

                    <button onClick={handleClearHistory} className="danger-btn">
                        Clear Chat History ({settings.chatHistory?.length || 0})
                    </button>
                </div>

                <div className="setting-group">
                    <h3>About</h3>
                    <div className="info-text">
                        <Sparkles size={16} />
                        <span>Powered by Google Gemini API</span>
                    </div>
                    <div className="info-text">
                        <span>Free tier: 1500 requests/day</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

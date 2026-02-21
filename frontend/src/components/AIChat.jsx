import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Code, Loader } from 'lucide-react';
import aiService from '../services/aiService';
import aiSettings from '../utils/aiStorage';

/**
 * AI Chat Panel - Sliding chat interface
 */
export default function AIChat({ isOpen, onClose, language, code, onInsertCode }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Load chat history on mount
    useEffect(() => {
        const history = aiSettings.get('chatHistory') || [];
        if (history.length > 0) {
            setMessages(history.map(h => [
                { role: 'user', content: h.message },
                { role: 'assistant', content: h.response },
            ]).flat());
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const result = await aiService.chat(userMessage, { code, language });

            const assistantMessage = result.response;
            setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

            // Save to history
            aiSettings.addChatMessage(userMessage, assistantMessage);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'error',
                content: error.message || 'Failed to get response',
            }]);
        } finally {
            setLoading(false);
        }
    };

    const extractCode = (text) => {
        const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
        const matches = [...text.matchAll(codeBlockRegex)];
        return matches.map(m => m[1].trim());
    };

    const handleInsert = (codeToInsert) => {
        if (onInsertCode) {
            onInsertCode(codeToInsert);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ai-chat-panel">
            <div className="chat-header">
                <div className="title">
                    <Sparkles size={20} />
                    <span>AI Assistant</span>
                </div>
                <button onClick={onClose} className="close-btn" aria-label="Close chat">
                    <X size={20} />
                </button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <Sparkles size={32} />
                        <p>Ask me anything about your code!</p>
                        <div className="suggestions">
                            <button onClick={() => setInput('Explain this code')}>Explain this code</button>
                            <button onClick={() => setInput('Find bugs')}>Find bugs</button>
                            <button onClick={() => setInput('Add comments')}>Add comments</button>
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <div className="message-content">
                            {msg.role === 'assistant' && extractCode(msg.content).length > 0 ? (
                                <>
                                    <p>{msg.content.split('```')[0]}</p>
                                    {extractCode(msg.content).map((codeBlock, i) => (
                                        <div key={i} className="code-block">
                                            <pre><code>{codeBlock}</code></pre>
                                            <button
                                                onClick={() => handleInsert(codeBlock)}
                                                className="insert-code-btn"
                                            >
                                                <Code size={14} />
                                                Insert
                                            </button>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="message assistant loading">
                        <Loader className="spinner" size={16} />
                        <span>Thinking...</span>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything about your code..."
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}

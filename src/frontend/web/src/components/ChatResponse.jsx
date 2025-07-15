import React, { useState } from 'react';
import './ChatResponse.css';
import { formatRelativeTime } from '../utils/dateUtils';

function ChatResponse({ response, answer, sources }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="chat-response">
            <div className="response-container">
                <div className="response-header">
                    <div className="response-meta">
                        <span className="response-time">
                            {formatRelativeTime(response.timestamp)}
                        </span>
                    </div>
                    {response.query && (
                        <div className="response-query">
                            <strong>Recherche :</strong> {response.query}
                        </div>
                    )}
                </div>

                <div className="response-content">
                    <div className="response-text">
                        {response.text || answer}
                    </div>
                </div>

                {sources && sources.length > 0 && (
                    <div className="sources-section">
                        <div className="sources-header">
                            <button 
                                className="sources-toggle"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                <span className="sources-icon">📄</span>
                                <span className="sources-text">
                                    {sources.length} Source{sources.length > 1 ? 's' : ''}
                                </span>
                                <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                                    ▼
                                </span>
                            </button>
                        </div>

                        {isExpanded && (
                            <div className="sources-list">
                                {sources.map((source, index) => (
                                    <div key={index} className="source-item">
                                        <div className="source-content">
                                            <a 
                                                href={source.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="source-title"
                                            >
                                                {source.title}
                                            </a>
                                            {source.provider && (
                                                <span className="source-provider">
                                                    {source.provider}
                                                </span>
                                            )}
                                            {source.date && (
                                                <span className="source-date">
                                                    {new Date(source.date).toLocaleDateString('fr-FR')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="source-actions">
                                            <button 
                                                className="source-action-btn"
                                                onClick={() => window.open(source.url, '_blank')}
                                                title="Ouvrir dans un nouvel onglet"
                                            >
                                                🔗
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatResponse;

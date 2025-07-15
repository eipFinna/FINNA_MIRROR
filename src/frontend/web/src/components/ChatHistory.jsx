import React, { useState } from 'react';
import { formatRelativeTime } from '../utils/dateUtils';

function ChatHistory({ searchHistory, setCurrentResponse, onRefresh, isLoading, setSources }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrer l'historique basé sur le terme de recherche
    const filteredHistory = searchHistory.filter(item => 
        !searchTerm.trim() || 
        item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleClick = (historyItem) => {
        // Obtenir les articles pour cette recherche
        console.log('Chargement des articles pour l’historique:', historyItem);
        console.log(historyItem.articles)


        // changer les sources
        setSources(historyItem.articles);

        setCurrentResponse({
            id: historyItem.id,
            text: historyItem.summary || `Résultats pour : "${historyItem.query}"`,
            timestamp: historyItem.timestamp,
            query: historyItem.query,
            isFromHistory: true
        });
    };

    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh();
        }
    };

    return (
        <div className="chat-history">
            <div className="history-header">
                <div className="search-history-input">
                    <input
                        type="text"
                        placeholder="Rechercher dans l'historique..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="history-search-input"
                    />
                </div>
                <button 
                    onClick={handleRefresh}
                    className="refresh-history-btn"
                    title="Actualiser l'historique"
                    disabled={isLoading}
                >
                    {isLoading ? '⟳' : '↻'}
                </button>
            </div>

            {isLoading ? (
                <div className="history-loading">Chargement de l'historique...</div>
            ) : filteredHistory.length === 0 ? (
                <p className="empty-history">
                    {searchTerm ? 'Aucune recherche correspondante trouvée' : 'Aucun historique de recherche pour le moment'}
                </p>
            ) : (
                <ul className="history-list">
                    {filteredHistory.map((item) => (
                        <li 
                            key={item.id} 
                            className="history-item" 
                            onClick={() => handleClick(item)}
                            title={item.summary ? `${item.query}\n\n${item.summary.substring(0, 100)}...` : item.query}
                        >
                            <div className="history-item-content">
                                <div className="message-time">
                                    {formatRelativeTime(item.timestamp)}
                                </div>
                                <div className="message-text">
                                    {item.query}
                                </div>
                                {item.summary && (
                                    <div className="message-preview">
                                        {item.summary.substring(0, 50)}...
                                    </div>
                                )}
                                {item.articleIds && item.articleIds.length > 0 && (
                                    <div className="articles-count">
                                        {item.articleIds.length} article{item.articleIds.length > 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ChatHistory;

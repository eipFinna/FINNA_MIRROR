import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';
import ChatResponse from '../components/ChatResponse';
import { useAuthRequired } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { getPastUserSearches } from '../services/articleApi'; // Utilise la fonction existante
import './Finna.css';
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'

const FinnaPage = () => {
    const [searchHistory, setSearchHistory] = useState([]);
    const [articles, setArticles] = useState([]); // Stocker tous les articles séparément
    const [answer, setAnswer] = useState('');
    const [currentResponse, setCurrentResponse] = useState(null);
    const [sources, setSources] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [currentQuery, setCurrentQuery] = useState('');
    
    const navigate = useNavigate();
    const { isAuthenticated, user, isLoading, shouldRedirect, logout } = useAuthRequired('/login');

    // Charger l'historique des recherches lors du montage du composant
    useEffect(() => {
        if (isAuthenticated && user) {
            loadSearchHistory();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (shouldRedirect) {
            navigate('/login');
        }
    }, [shouldRedirect, navigate]);

    const loadSearchHistory = async () => {
        setHistoryLoading(true);
        try {
            // Utiliser la fonction getPastUserSearches existante avec userId
            const result = await getPastUserSearches(user.id);
            console.log('Historique des recherches chargé:', result);
            
            if (result && result.success) {
                setSearchHistory(result.searches || []);
                setArticles(result.articles || []);
            } else {
                console.error('Échec du chargement de l\'historique des recherches:', result?.error || 'Erreur inconnue');
                console.error('Objet de résultat complet:', result);
            }
        } catch (error) {
            console.error('Erreur lors du chargement de l\'historique des recherches:', error);
            if (error.message.includes('Authentication required')) {
                navigate('/login');
            }
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            setSearchHistory([]);
            setArticles([]);
            setCurrentResponse(null);
            navigate('/login');
        } else {
            console.error('Échec de la déconnexion:', result.error);
            navigate('/login');
        }
    };

    const handleSendMessage = async (text) => {
        setIsSearchLoading(true);
        setIsError(false);

        try {
            console.log(currentQuery)
            setCurrentResponse({
                id: Date.now(),
                text: text,
                timestamp: new Date().toISOString(),
                //put the text in the query field to match the backend's expected format
                query: currentQuery,
                isFromHistory: false
            });
            // setSources(sources || []);
            // setAnswer(data.summary || '');

            // Actualiser l'historique pour inclure la nouvelle recherche (délai pour permettre au backend de sauvegarder)
            setTimeout(() => {
                loadSearchHistory();
            }, 1000);

        } catch (error) {
            console.error('Échec de la recherche:', error);
            setCurrentResponse({
                id: Date.now(),
                text: `Erreur lors de la recherche pour : "${text}"`,
                timestamp: new Date().toISOString(),
                query: text,
                articles: [],
                isFromHistory: false
            });
            setIsError(true);
        } finally {
            setIsSearchLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading">Chargement...</div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="finna-page">
            <div className="finna-header">
                <div className="user-info">
                    <span>Bienvenue, {user?.email}</span>
                    <button onClick={handleLogout} className="logout-button">
                        Déconnexion
                    </button>
                </div>
            </div>

            <div className="finna-page-container">
                <div className="finna-content">
                    <aside className="history-panel">
                        <h2>Historique des Recherches</h2>
                        <ChatHistory
                            searchHistory={searchHistory}
                            setCurrentResponse={setCurrentResponse}
                            onRefresh={loadSearchHistory}
                            isLoading={historyLoading}
                            setSources={setSources}
                        />
                    </aside>

                    <main className="chat-panel">
                        <div className="chat-content">
                            {currentResponse && (
                                <ChatResponse
                                    response={currentResponse}
                                    answer={answer}
                                    sources={sources}
                                />
                            )}
                            {isSearchLoading && (
                                <div className="loading-container">
                                    <TailChase
                                        size="40"
                                        speed="1.75"
                                        color="black"
                                    />
                                </div>
                            )}
                            {isError && (
                                <div className="error-container">
                                    <div className="error-message">
                                        Une erreur s'est produite lors de la récupération des articles.
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="input-container">
                            <ChatInput 
                                onSendMessage={handleSendMessage} 
                                setSources={setSources} 
                                setIsLoading={setIsSearchLoading} 
                                setIsError={setIsError}
                                isLoading={isSearchLoading}
                                user={user}
                                setCurrentQuery={setCurrentQuery}
                            />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default FinnaPage;
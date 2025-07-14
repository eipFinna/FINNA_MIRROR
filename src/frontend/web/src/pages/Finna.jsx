import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';
import ChatResponse from '../components/ChatResponse';
import { useAuthRequired } from '../hooks/useAuth';
import { authService } from '../services/authService';
import './Finna.css';
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'

const FinnaPage = () => {
  const [messages, setMessages] = useState([]);
  const [answer, setAnswer] = useState('');
  const [currentResponse, setCurrentResponse] = useState(null);
  const [sources, setSources] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false); // Added this state
  const [isError, setIsError] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, shouldRedirect, logout } = useAuthRequired('/login');

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/login');
    }
  }, [shouldRedirect, navigate]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setMessages([]);
      setCurrentResponse(null);
      navigate('/login');
    } else {
      console.error('Logout failed:', result.error);
      navigate('/login');
    }
  };

  const handleSendMessage = async (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
    };  
    setMessages([...messages, newMessage]);
    setIsSearchLoading(true);
    setIsError(false);

    try {
      setCurrentResponse({
        id: Date.now() + 1,
        text: text || `Search results for: "${text}"`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Search failed:', error);
      setCurrentResponse({
        id: Date.now() + 1,
        text: `Error searching for: "${text}"`,
        timestamp: new Date().toISOString(),
      });
      setIsError(true);
    } finally {
      setIsSearchLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="finna-page">
        <div className="loading">Loading...</div>
      </div>
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
            Logout
          </button>
        </div>
      </div>

      <div className="finna-page-container">
        <div className="finna-content">
          <aside className="history-panel">
            <h2>Chat History</h2>
            <ChatHistory 
              messages={messages} 
              setCurrentResponse={setCurrentResponse} 
            />
          </aside>
          
          <main className="chat-panel">
            {currentResponse && (
              <ChatResponse 
                response={currentResponse} 
                answer={answer} 
                sources={sources} 
              />
            )}
            <div className="input-container">
              <ChatInput 
                onSendMessage={handleSendMessage} 
                setSources={setSources} 
                setIsLoading={setIsSearchLoading} 
                setIsError={setIsError}
                isLoading={isSearchLoading}
                user={user}
              />
            </div>
            {isSearchLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <TailChase
                  size="40"
                  speed="1.75"
                  color="black"
                />
              </div>
            )}
            {isError && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '20px' }}>
                <div className="error-message" style={{ color: 'red'}}>
                    Une erreur s'est produite lors de la récupération des articles.
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default FinnaPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';
import ChatResponse from '../components/ChatResponse';
import { useAuthRequired } from '../hooks/useAuth';
import { authService } from '../services/authService';
import './Finna.css';

const FinnaPage = () => {
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);
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

    try {
      const response = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(text)}`);
      const data = await response.json();
      
      setCurrentResponse({
        id: Date.now() + 1,
        text: data.summary || `Search results for: "${text}"`,
        timestamp: new Date().toISOString(),
        articles: data.articles || []
      });
    } catch (error) {
      console.error('Search failed:', error);
      setCurrentResponse({
        id: Date.now() + 1,
        text: `Error searching for: "${text}"`,
        timestamp: new Date().toISOString(),
      });
    }

    const result = await authService.makeAuthenticatedRequest('http://localhost:5000/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: text,
        timestamp: new Date().toISOString()
      })
    });

    if (!result.success && result.status === 401) {
      navigate('/login');
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
              <ChatResponse response={currentResponse} />
            )}
            <div className="input-container">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FinnaPage;
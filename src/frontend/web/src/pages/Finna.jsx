import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';
import ChatResponse from '../components/ChatResponse';
import './Finna.css';

const FinnaPage = () => {
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/me', {
        credentials: 'include' // Important: include cookies
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        // Redirect to login if not authenticated
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Redirect to login on error
      navigate('/login');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Clear local state
        setIsAuthenticated(false);
        setUser(null);
        setMessages([]);
        setCurrentResponse(null);
        
        // Redirect to login page
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout request fails, clear local state and redirect
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    }
  };

  const makeAuthenticatedRequest = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include' // Include cookies for session
      });
      
      if (response.status === 401) {
        // Session expired or not authenticated - redirect to login
        navigate('/login');
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Authenticated request failed:', error);
      return null;
    }
  };

  const handleSendMessage = async (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessage]);

    // For search functionality, no auth required
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

    // Save to history for authenticated users
    try {
      await makeAuthenticatedRequest('http://localhost:5000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: text,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="finna-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // Only render if authenticated (after loading is complete)
  if (!isAuthenticated) {
    return null; // Component will redirect, so return nothing
  }

  return (
    <div className="finna-page">
      {/* Header with user info and logout */}
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
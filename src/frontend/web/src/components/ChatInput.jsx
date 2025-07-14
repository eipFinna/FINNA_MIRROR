import React, { useState } from 'react';
import { searchArticles } from '../services/articleApi';

function ChatInput({ onSendMessage, setSources, setIsLoading, setIsError, isLoading }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent submission if already loading or message is empty
    if (isLoading || !message.trim()) return;
    
    console.log('Sending message:', message);
    setIsError(false);
    setIsLoading(true);
    searchArticles(message)
      .then(response => {
        console.log('Articles found:', response);
        setIsLoading(false);
        if (message.trim()) {
          setSources(response.articles);
          onSendMessage(response.summary);
          setMessage('');
        }
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setIsError(true);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Votre message ici..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !message.trim()}
          style={{
            backgroundColor: isLoading ? '#6c757d' : '',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default ChatInput;

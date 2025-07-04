import React, { useState } from 'react';
import { searchArticles } from '../services/articleApi';

function ChatInput({ onSendMessage, setSources }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending message:', message);
    searchArticles(message)
      .then(response => {
        console.log('Articles found:', response);
        if (message.trim()) {
          setSources(response.articles);
          onSendMessage(response.summary);
          setMessage('');
        }
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder="Votre message ici..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit" className="send-button">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </form>
  );
}

export default ChatInput;

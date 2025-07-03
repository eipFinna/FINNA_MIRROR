import React, { useState } from 'react';
import ChatHistory from '../components/ChatHistory';
import ChatInput from '../components/ChatInput';
import ChatResponse from '../components/ChatResponse';
import './Finna.css';

const FinnaPage = () => {
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState(null);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessage]);
    
    setTimeout(() => {
      setCurrentResponse({
        id: Date.now() + 1,
        text: `This is a response to: "${text}"`,
        timestamp: new Date().toISOString(),
      });
    }, 500);
  };

  return (
    <div className="finna-page">
      <div className="finna-page-container">
        <aside className="history-panel">
          <h2>Chat History</h2>
          <ChatHistory messages={messages} setCurrentResponse={setCurrentResponse} />
        </aside>
        <main className="chat-panel">
          {currentResponse && <ChatResponse response={currentResponse} />}
          <div className="input-container">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinnaPage;
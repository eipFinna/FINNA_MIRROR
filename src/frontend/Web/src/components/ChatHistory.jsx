import React from 'react';
import { formatRelativeTime } from '../utils/dateUtils';

function ChatHistory({ messages, setCurrentResponse }) {
    const handleClick = (message) => {
        setTimeout(() => {
            setCurrentResponse({
              id: message.id,
              text: `This is a response to: "${message.text}"`,
              timestamp: message.timestamp,
            });
        }, 500);
    };

    return (
        <div className="chat-history">
          {messages.length === 0 ? (
            <p className="empty-history">No messages yet</p>
          ) : (
            <ul>
              {messages.map((message) => (
                <li key={message.id} className="history-item" onClick={() => handleClick(message)}>
                    <div className="message-time">{formatRelativeTime(message.timestamp)}</div>
                    <div className="message-text">{message.text}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
    );
}

export default ChatHistory;

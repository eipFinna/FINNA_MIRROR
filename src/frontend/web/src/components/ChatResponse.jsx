import React from 'react';
import { formatRelativeTime } from '../utils/dateUtils';

function ChatResponse({ response }) {
  return (
    <div className="chat-response">
      <div className="response-bubble">
        <p>{response.text}</p>
        <span className="response-time">{formatRelativeTime(response.timestamp)}</span>
      </div>
    </div>
  );
}

export default ChatResponse;

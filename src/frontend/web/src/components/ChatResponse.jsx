import React from 'react';
import { formatRelativeTime } from '../utils/dateUtils';

function ChatResponse({ response, sources }) {
  const [isSourceVisible, setSourceVisible] = React.useState(false);
  const [isAnswer, setIsAnswer] = React.useState(false);

  React.useEffect(() => {
    if (response.text !== "Aucun article pertinent trouvé.") {
      setIsAnswer(true);
    } else {
      setIsAnswer(false);
    }
  }, [response.text]);

  return (
    <div className="chat-response">
      {isSourceVisible && (
        <div className="source-list">
          <ul>
            {sources.map((source, idx) => (
              <li key={idx} className="source-item">
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
                <span className="source-date">{formatRelativeTime(source.date)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isAnswer && (
              <button className="open-source" onClick={() => setSourceVisible(!isSourceVisible)}>
        <span className="source-icon">🔗</span>
        <span className="source-text">{isSourceVisible ? 'Cacher les sources' : 'Afficher les sources'}</span>
      </button>
        
        )}

      <div className="response-bubble">
        <p>{response.text}</p>
        <span className="response-time">{formatRelativeTime(response.timestamp)}</span>
      </div>

    </div>
  );
}

export default ChatResponse;

import React, { useEffect, useState } from 'react';
import './Popup.css';
import { format } from 'date-fns';

const Popup = () => {
  const [text, setText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  const [articleLength, setArticleLength] = useState(0);
  const [articles, setArticles] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(
      ['savedText', 'savedInputText', 'savedLink', 'savedDate', 'savedArticleLength', 'savedArticles', 'tmpText', 'selectedText'],
      (result) => {
        if (result.selectedText) {
          setInputText(result.selectedText);
          chrome.storage.local.set({ tmpText: result.selectedText });
        } else if (result.savedInputText) {
          setInputText(result.savedInputText);
        }

        if (result.savedText) {
          setText(result.savedText);
          setLink(result.savedLink || '');
          setDate(result.savedDate || '');
          setArticleLength(result.savedArticleLength || 0);
          setArticles(result.savedArticles || []);
        }
      }
    );
  }, []);

  const saveResults = (data) => {
    chrome.storage.local.set({
      savedText: data.summary,
      savedInputText: inputText,
      savedLink: data.articles[0].url,
      savedDate: format(new Date(data.articles[0].date), 'dd/MM/yyyy'),
      savedArticleLength: data.articles.length,
      savedArticles: data.articles
    });
  };

  const analyseText = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await fetch(`http://localhost:5000/search?q=${inputText}`);
      const json = await response.json();

      if (!json || !json.summary || !json.articles || json.articles.length === 0) {
        setText('Aucun résultat trouvé.');
        setArticles([]);
        setLink('');
        setDate('');
        setArticleLength(0);
        return;
      }

      setText(json.summary);
      setArticles(json.articles);
      setLink(json.articles[0].url);
      setDate(format(new Date(json.articles[0].date), 'dd/MM/yyyy'));
      setArticleLength(json.articles.length);

      saveResults(json);
      chrome.storage.local.remove(['tmpText', 'selectedText']);
    } catch (error) {
      setError(true);
      setText('');
      setArticles([]);
      setLink('');
      setDate('');
      setArticleLength(0);
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="App">
      <div className="App-header">
        Finna
      </div>

      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Texte à analyser"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button className="auth-button" onClick={analyseText} disabled={isLoading}>
          {isLoading ? (
            <span className="dot-spinner">
              <span></span>
            </span>
          ) : (
            'Vérifier'
          )}
        </button>
      </div>

      {error && <p className="error-message">Une erreur est survenue, veuillez réessayer plus tard</p>}

      {text && (
        <div className="form-group result-box">
          <h3>Résumé</h3>
          <p>{text}</p>
          <p className="source-count">{articleLength} sources trouvées</p>
          <button className="auth-button" onClick={togglePanel}>Voir les sources →</button>
        </div>
      )}

      {isPanelOpen && (
        <div className="drawer">
          <div className="drawer-header">
            <h3>Sources ({articleLength})</h3>
            <button className="close-button" onClick={togglePanel}>×</button>
          </div>
          <div className="drawer-content">
            {articles.map((article, i) => (
              <div className="source-card" key={i}>
                <h4>{article.title}</h4>
                <p>Source: {article.provider}</p>
                <p>Date: {format(new Date(article.date), 'dd/MM/yyyy')}</p>
                <a href={article.url} target="_blank" rel="noreferrer">Voir l'article →</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
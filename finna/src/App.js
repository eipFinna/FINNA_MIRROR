import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Téléchargez notre extension web révolutionnaire: Finna !</h1>
        <p>
          Retrouvez les sources de ce que vous lisez! Simple, rapide et efficace.
        </p>
        <a
          className="App-download"
          href="./extension-finna-test.html"
          download
        >
          <button className="download-button">Télécharger l'extension</button>
        </a>
        <p className="small-text">
          Disponible sur Chrome, Firefox, Edge et Safari (je crois).
        </p>
      </header>
    </div>
  );
}

export default App;
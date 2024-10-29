import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Finna : Votre Extension Révolutionnaire</h1>
      </header>

      {/* Section par slide */}
      <section className="slide">
        <h2>Qu'est-ce que Finna ?</h2>
        <p>Finna est une extension web conçue pour vous aider à retrouver les sources des informations que vous lisez en ligne.</p>
      </section>

      <section className="slide">
        <h2>Pourquoi utiliser Finna ?</h2>
        <p>Elle est simple, rapide et vous garantit une transparence totale des sources.</p>
      </section>

      <section className="slide">
        <h2>Disponible sur les principaux navigateurs</h2>
        <p>Compatible avec Chrome, Firefox, Edge et, peut-être, Safari.</p>
      </section>

      <section className="slide download-slide">
        <h2>Prêt à l'essayer ?</h2>
        <a
          className="App-download"
          href="./extension-finna-test.html"
          download
        >
          <button className="download-button">Télécharger Finna</button>
        </a>
      </section>
    </div>
  );
}

export default App;

import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Finna : Votre Extension Révolutionnaire</h1>
        <p>
          Vérifiez rapidement la fiabilité des informations grâce à notre outil
          intelligent et intuitif.
        </p>
        <a href="#download" className="cta-button">
          Télécharger Finna
        </a>
      </div>
    </header>
  );
};

export default Header;
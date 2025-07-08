import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

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
        <button
          className="login-button"
          onClick={() => navigate("/login")}
        >
          Se connecter
        </button>
      </div>
    </header>
  );
};

export default Header;
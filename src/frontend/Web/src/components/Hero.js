import React from "react";
import "./Hero.css";

const Hero = () => {

    return (
    <section className="hero">
        <div className="hero-container">
          <h2 className="hero-title">Vérifiez la fiabilité des infos en un clic</h2>
          <p className="hero-subtitle">Finna vous aide à repérer les sources et à obtenir des résumés concis pour naviguer en toute confiance.</p>
          <a href="#download" className="hero-button">Ajouter Finna</a>
        </div>
      </section>

    );
};

export default Hero;
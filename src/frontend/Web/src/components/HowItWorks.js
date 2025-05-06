import React from "react";
import "./HowItWorks.css"

const HowItWorks = () => {

    return (
    <section id="how-it-works" className="how-it-works">
        <h3 className="section-title">Comment ça marche ?</h3>
        <div className="how-steps">
          <div className="step">
            <h4>1. Sélectionnez le texte</h4>
            <p>Mettez en surbrillance l'information douteuse.</p>
          </div>
          <div className="step">
            <h4>2. Cliquez sur l'icône Finna</h4>
            <p>Accédez instantanément à la source et au résumé.</p>
          </div>
          <div className="step">
            <h4>3. Consultez et partagez</h4>
            <p>Soyez informé et partagez des infos fiables.</p>
          </div>
        </div>
      </section>
    );
};

export default HowItWorks;
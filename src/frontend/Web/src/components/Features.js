import React from "react";
import "./Features.css";

const Features = () => {
  // const features = [
  //   {
  //     title: "Fiabilité instantanée",
  //     description: "Trouvez les sources des informations en un clic.",
  //   },
  //   {
  //     title: "Simplicité d’utilisation",
  //     description: "Interface intuitive pour une navigation fluide.",
  //   },
  //   {
  //     title: "Compatible tous navigateurs",
  //     description: "Disponible sur Chrome, Firefox, Edge, et Safari.",
  //   },
  // ];

  return (
  //   <section className="features">
  //     <h2>Pourquoi choisir Finna ?</h2>
  //     <div className="features-grid">
  //       {features.map((feature, index) => (
  //         <div className="feature-card" key={index}>
  //           <h3>{feature.title}</h3>
  //           <p>{feature.description}</p>
  //         </div>
  //       ))}
  //     </div>
  //   </section>
  <section id="features" className="features">
        <h3 className="section-title">Fonctionnalités clés</h3>
        <div className="features-grid">
          <div className="feature-item">
            <h4>Sources fiables</h4>
            <p>Identifiez rapidement l'origine des informations.</p>
          </div>
          <div className="feature-item">
            <h4>Résumé instantané</h4>
            <p>Obtenez un aperçu clair et concis.</p>
          </div>
          <div className="feature-item">
            <h4>Extension légère</h4>
            <p>Performance optimale sans ralentir votre navigation.</p>
          </div>
        </div>
      </section>
  );
};

export default Features;

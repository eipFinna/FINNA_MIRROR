import React from "react";
import "./Features.css";

const Features = () => {
  const features = [
    {
      title: "Fiabilité instantanée",
      description: "Trouvez les sources des informations en un clic.",
    },
    {
      title: "Simplicité d’utilisation",
      description: "Interface intuitive pour une navigation fluide.",
    },
    {
      title: "Compatible tous navigateurs",
      description: "Disponible sur Chrome, Firefox, Edge, et Safari.",
    },
  ];

  return (
    <section className="features">
      <h2>Pourquoi choisir Finna ?</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

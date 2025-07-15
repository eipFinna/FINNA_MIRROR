import React, { useState } from "react";
import "./Documentation.css";

const Documentation = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <section className="documentation-container">
      <button className="toggle-button" onClick={toggleVisibility}>
        {isVisible ? "Masquer la documentation" : "À propos de Finna"}
      </button>

      {isVisible && (
        <div className="documentation">
          <h2>À propos de Finna</h2>
          <p>
            Dans un monde où les fausses informations circulent largement, Finna a été créé pour
            offrir une solution efficace et accessible à tous. En France, près de 30% des
            citoyens estiment qu'ils ne peuvent pas détecter les fausses informations, et notre mission
            est de changer cela.
          </p>
          <h3>Notre Vision</h3>
          <p>
            Finna a pour objectif de simplifier la comparaison d'informations afin de garantir leur
            authenticité. Notre outil vous permet de vérifier rapidement la source d'une
            information, d'identifier sa première apparition, et d'évaluer sa fiabilité.
          </p>
          <h3>Comment cela fonctionne ?</h3>
          <ul>
            <li>Téléchargez notre extension via notre site web.</li>
            <li>Sélectionnez un extrait d'article, un tweet ou tout texte douteux.</li>
            <li>Soumettez-le à Finna pour vérifier les sources disponibles.</li>
            <li>Consultez un résumé généré par notre IA, accompagné des sources associées.</li>
          </ul>
          <h3>Technologies Utilisées</h3>
          <p>
            Pour garantir une expérience optimale, Finna s'appuie sur des technologies modernes :
          </p>
          <ul>
            <li>PostGres pour la base de données</li>
            <li>React pour le front-end</li>
            <li>Node.js pour le serveur back-end</li>
            <li>Python pour le scraping de données</li>
            <li>Une IA avancée pour résumer et analyser les informations</li>
          </ul>
          <p>
            Ensemble, faisons face à la désinformation et construisons un internet plus fiable !
          </p>
        </div>
      )}
    </section>
  );
};

export default Documentation;

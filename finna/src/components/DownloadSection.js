import React from "react";
import "./DownloadSection.css";

const DownloadSection = () => {
  return (
    <section id="download" className="download-section">
      <h2>Prêt à essayer Finna ?</h2>
      <p>
        Téléchargez notre extension maintenant et rejoignez une communauté
        engagée à vérifier les sources.
      </p>
      <a
        href="./extension-finna-test.html"
        download
        className="download-button"
      >
        Télécharger Finna
      </a>
    </section>
  );
};

export default DownloadSection;

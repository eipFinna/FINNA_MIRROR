import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2024 Finna. Tous droits réservés.</p>
      <p>
        Suivez-nous sur :{" "}
        <a href="https://twitter.com/Finna" target="_blank" rel="noreferrer">
          Twitter
        </a>
        ,{" "}
        <a href="https://instagram.com/Finna" target="_blank" rel="noreferrer">
          Instagram
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;

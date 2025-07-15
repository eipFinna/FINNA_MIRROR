import React, { useState } from "react";
import "./UserFeedback.css";

const UserFeedback = () => {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(REACT_APP_API_BASE_URL + "/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, feedback }),
    });
    console.log("Feedback soumis :", { email, feedback });

    setEmail("");
    setFeedback("");
    alert("Merci pour votre retour !");
  };

  const isFormValid = email.trim() !== "" && feedback.trim() !== "";

  return (
    <section id="user-feedback" className="user-feedback-section">
      <h2>Vos retours comptent !</h2>
      <p>
        Aidez-nous à améliorer Finna en partageant vos idées, suggestions ou
        problèmes rencontrés.
      </p>
      <form onSubmit={handleSubmit} className="feedback-form">
        {/* Champ pour l'adresse e-mail */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Adresse e-mail :
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse e-mail"
            required
            className="email-input"
          />
        </div>

        {/* Champ pour le feedback */}
        <div className="form-group">
          <label htmlFor="feedback" className="form-label">
            Votre feedback :
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Écrivez votre commentaire ici... (Veuillez d'abord renseigner votre adresse mail)"
            required
            disabled={!email.trim()}
          ></textarea>
        </div>

        <button
          type="submit"
          className="feedback-button"
          disabled={!isFormValid}
        >
          Envoyer
        </button>
      </form>
    </section>
  );
};

export default UserFeedback;

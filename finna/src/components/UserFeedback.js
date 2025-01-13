import React, { useState } from "react";
import "./UserFeedback.css";

const UserFeedback = () => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    /*pour le backend plus tard*/
    console.log("Feedback soumis :", feedback);

    setFeedback("");
    alert("Merci pour votre retour !");
  };

  return (
    <section id="user-feedback" className="user-feedback-section">
      <h2>Vos retours comptent !</h2>
      <p>
        Aidez-nous à améliorer Finna en partageant vos idées, suggestions ou
        problèmes rencontrés.
      </p>
      <form onSubmit={handleSubmit} className="feedback-form">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Écrivez votre commentaire ici..."
          required
        ></textarea>
        <button type="submit" className="feedback-button">
          Envoyer
        </button>
      </form>
    </section>
  );
};

export default UserFeedback;

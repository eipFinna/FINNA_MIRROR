exports.googleAuth = (req, res) => {
    // Ne fait rien, le middleware de passport prend le relai
  };
  
  exports.googleAuthCallback = (req, res) => {
    // Redirige vers le frontend avec l’utilisateur loggé
    res.redirect('http://localhost:3000/finna');
  };
  
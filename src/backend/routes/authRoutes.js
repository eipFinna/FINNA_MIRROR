const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');

// Route pour initier l'auth Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Route de callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleAuthCallback
);

module.exports = router;

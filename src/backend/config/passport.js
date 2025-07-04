const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// à modifier dans un .env, pour des raisons qui me semblent evidentes ...
const GOOGLE_CLIENT_ID = 'secret.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'secret';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Ici on peut créer ou récupérer l’utilisateur dans la base
  console.log('Google profile:', profile);
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;

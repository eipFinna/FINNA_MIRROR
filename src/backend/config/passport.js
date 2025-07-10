const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dbService = require('../services/dbService');
require('dotenv').config();

console.log("coucou");
console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile:', profile);
    console.log('accessToken:', accessToken);
    console.log('refreshToken:', refreshToken);
    
    // Create or find user in database
    const user = await dbService.findOrCreateGoogleUser(profile);
    return done(null, user);
  } catch (error) {
    console.error('Error in Google strategy:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id); // Store only user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await dbService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

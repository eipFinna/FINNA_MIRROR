const express = require('express');
const cors = require('cors');
const appConfig = require('./config/appConfig');

const searchRoutes = require('./routes/searchRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const { pool } = require('./config/dbConfig'); // Make sure to export pool from dbConfig

const app = express();
require('dotenv').config();

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true // Important: allow cookies
}));
app.use(express.json());

// Enhanced session configuration with PostgreSQL storage
app.use(session({
  store: new pgSession({
    pool: pool, // Connection pool from your dbConfig
    tableName: 'user_sessions', // Will be created automatically
    createTableIfMissing: true, // Add this line
  }),
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware function
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required', authenticated: false });
}

// Public routes (no authentication required)
app.use('/search', searchRoutes); // Keep search public
app.use('/auth', authRoutes); // Auth routes (Google OAuth)
app.use('/register', registerRoutes); // Keep registration public
app.use('/login', loginRoutes); // Keep login public but update controller

app.get('/', (req, res) => {
    res.send('Welcome to the backend API');
});

// Protected routes (authentication required)
app.use('/feedback', requireAuth, feedbackRoutes);
app.use('/metrics', requireAuth, metricsRoutes);

// Test session route
app.get('/test-session', (req, res) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('User:', req.user);
    
    res.json({
        sessionID: req.sessionID,
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        session: req.session
    });
});

app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port}`);
});
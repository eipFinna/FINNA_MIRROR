const express = require('express');
const cors = require('cors');
const appConfig = require('./config/appConfig');

const searchRoutes = require('./routes/searchRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const registerRoutes = require ('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

const session = require('express-session'); //
const passport = require('./config/passport'); //            auth google
const authRoutes = require('./routes/authRoutes'); //

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use(session({
    secret: 'supersecret', // peut etre remplacer dans un .env avec un vrai secret 
    resave: false,
    saveUninitialized: false,
  }));
app.use(passport.initialize());
app.use(passport.session());
  

app.use('/search', searchRoutes); // A remplacer par "/api/search" pour les routes (car je ne peux pas modifier l'extension pour le moment)
app.use('/feedback', feedbackRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/metrics', metricsRoutes);
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the backend API');
});


app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port}`);
});
const express = require('express');
const cors = require('cors');
const appConfig = require('./config/appConfig');

const searchRoutes = require('./routes/searchRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/search', searchRoutes); // A remplacer par "/api/search" pour les routes (car je ne peux pas modifier l'extension pour le moment)
app.use('/feedback', feedbackRoutes);
app.use('/metrics', metricsRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the backend API');
});

app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port}`);
});

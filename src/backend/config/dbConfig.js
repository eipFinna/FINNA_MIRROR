const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'dbConfig.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const pool = new Pool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    ssl: {
        rejectUnauthorized: config.ssl.rejectUnauthorized,
        ca: config.ssl.ca,
    },
});

pool.connect((err) => {
    if (err) console.error('Erreur de connexion à PostgreSQL :', err.stack);
    else console.log('Connecté à PostgreSQL');
});

module.exports = pool;

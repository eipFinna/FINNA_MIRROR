const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'root',
    password: 'Finna',
    database: 'Finna_Database',
    port: 5432,
});

pool.connect((err) => {
    if (err) console.error('Erreur de connexion à PostgreSQL :', err.stack);
    else console.log('Connecté à PostgreSQL');
});

module.exports = pool;

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'temp_eip'
});

db.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

function replaceSpacesWithPercent(sentence) {
    return sentence.split(' ').join('%');
  }

app.get('/search', (req, res) => {
    let searchTerm = req.query.q;
    searchTerm = replaceSpacesWithPercent(searchTerm)
    const query = `
        SELECT Title, Body, Date, Link
        FROM article
        WHERE Title LIKE ? OR Body LIKE ?
    `;
    const searchPattern = `%${searchTerm}%`;
    db.query(query, [searchPattern, searchPattern], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
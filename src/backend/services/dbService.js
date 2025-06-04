const db = require('../config/dbConfig');

exports.searchArticles = async (keywords) => {
    const conditions = keywords.split(' ').map(word => `("article" ILIKE '%${word}%' OR "title" ILIKE '%${word}%')`).join(' AND ');
    const query = `
        SELECT "title", "article", "date", "url"
        FROM "article_tab"
        WHERE (${conditions})
    `;
    const result = await db.query(query);
    return result.rows;
};

exports.registerUserInDB = async (email, password) => {
    const query = `
        INSERT INTO "users" ("email", "password")
        VALUES ($1, $2)
        RETURNING "id", "email"
    `;
    const values = [email, password];
    console.log("registerUserInDB called with values:", values);
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
        throw new Error('User registration failed');
    }
    return result.rows[0];
}
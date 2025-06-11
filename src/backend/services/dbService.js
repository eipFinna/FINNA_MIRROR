const db = require('../config/dbConfig');

exports.searchArticles = async (keywords) => {
    const conditions = keywords.split(' ').map(word => `("article" ILIKE '%${word}%' OR "title" ILIKE '%${word}%')`).join(' AND ');
    const query = `
        SELECT "title", "article", "date", "url", "provider"
        FROM "article_tab"
        WHERE (${conditions})
    `;
    const result = await db.query(query);
    return result.rows;
};

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

exports.registerUserInDB = async (email, password) => {
    const query = `
        INSERT INTO "users" ("email", "password")
        VALUES ($1, $2)
        RETURNING "id", "email"
    `;
    const values = [email, password];
    console.log("registerUserInDB called with email:", email);
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
        throw new Error('User registration failed');
    }
    return result.rows[0];
}

exports.getUserByEmail = async (email) => {
    const query = `
        SELECT "id", "email", "password"
        FROM "users"
        WHERE "email" = $1
    `;
    const values = [email];
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
}

/**
 * Recherche des articles pertinents via full-text search
 * @param {string} keywords — chaîne brute extraite de l'utilisateur
 * @param {number} limit    — nombre max d'articles retournés
 */
const MIN_SCORE = parseFloat(process.env.MIN_SCORE || '0.15');

async function queryWithTerms(terms, limit) {
  const q = terms.join(' ');
  const sql = `
    SELECT title, article, date, url,
      ts_rank(
        setweight(to_tsvector('french', coalesce(title, '')), 'A')
        || setweight(tsv, 'B'),
        websearch_to_tsquery('french', $1)
      ) AS score
    FROM article_tab
    WHERE
      (to_tsvector('french', coalesce(title, '')) @@ websearch_to_tsquery('french', $1))
      OR
      (tsv @@ websearch_to_tsquery('french', $1))
    ORDER BY score DESC
    LIMIT $2;
  `;
  const { rows } = await db.query(sql, [q, limit]);
  return rows;
}

async function findArticlesByKeywords(keywordsArr, limit = 5) {
  // 1) essai avec tous les keywords
  let results = await queryWithTerms(keywordsArr, limit);
  // 2) fallback si aucun résultat
  let n = keywordsArr.length;
  while (results.length === 0 && n > 2) {
    n -= 1;  // on réduit d’un mot
    results = await queryWithTerms(keywordsArr.slice(0, n), limit);
  }
  return results;
}

module.exports = { findArticlesByKeywords };
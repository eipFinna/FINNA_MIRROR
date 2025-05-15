const pool = require('../config/dbConfig');

/**
 * Recherche des articles pertinents via full-text search
 * @param {string} keywords — chaîne brute extraite de l'utilisateur
 * @param {number} limit    — nombre max d'articles retournés
 */
async function queryWithTerms(terms, limit) {
  const q = terms.join(' ');
  const sql = `
    SELECT title, article, date, url,
           ts_rank(
             tsv,
             websearch_to_tsquery('french', $1)
           ) AS score
    FROM article_tab
    WHERE tsv @@ websearch_to_tsquery('french', $1)
    ORDER BY score DESC
    LIMIT $2;
  `;
  const { rows } = await pool.query(sql, [q, limit]);
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
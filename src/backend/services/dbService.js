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

exports.findOrCreateGoogleUser = async (googleProfile) => {
    const { id: googleId, emails } = googleProfile;
    const email = emails && emails[0] ? emails[0].value : null;

    // First, try to find existing user by Google ID
    let query = `
        SELECT "id", "email", "provider_id", "provider_name"
        FROM "users"
        WHERE "provider_id" = $1
    `;
    let result = await db.query(query, [googleId]);

    if (result.rows.length > 0) {
        return result.rows[0];
    }

    // If not found by Google ID, try by email
    if (email) {
        query = `
            SELECT "id", "email", "provider_id", "provider_name"
            FROM "users"
            WHERE "email" = $1
        `;
        result = await db.query(query, [email]);

        if (result.rows.length > 0) {
            const updateQuery = `
                UPDATE "users"
                SET "provider_id" = $1, "provider_name" = $2
                WHERE "email" = $3
                RETURNING "id", "email", "provider_id", "provider_name"
            `;
            const updateResult = await db.query(updateQuery, [
                googleId, 'google', email
            ]);
            return updateResult.rows[0];
        }
    }

    // Create new user
    const insertQuery = `
        INSERT INTO "users" ("email", "provider_id", "provider_name")
        VALUES ($1, $2, $3)
        RETURNING "id", "email", "provider_id", "provider_name"
    `;
    const insertResult = await db.query(insertQuery, [
        email, googleId, 'google'
    ]);
    return insertResult.rows[0];
};

exports.getUserById = async (id) => {
    const query = `
        SELECT "id", "email", "provider_id", "provider_name"
        FROM "users"
        WHERE "id" = $1
    `;
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
        return null;
    }
    return result.rows[0];
};

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
    n -= 1;  // on réduit d'un mot
    results = await queryWithTerms(keywordsArr.slice(0, n), limit);
  }
  return results;
}

module.exports = {
    searchArticles: exports.searchArticles,
    registerUserInDB: exports.registerUserInDB,
    getUserByEmail: exports.getUserByEmail,
    findOrCreateGoogleUser: exports.findOrCreateGoogleUser,
    getUserById: exports.getUserById,
    findArticlesByKeywords
};
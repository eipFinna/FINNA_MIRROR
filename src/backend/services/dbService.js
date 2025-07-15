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

    let query = `
        SELECT "id", "email", "provider_id", "provider_name"
        FROM "users"
        WHERE "provider_id" = $1
    `;
    let result = await db.query(query, [googleId]);

    if (result.rows.length > 0) {
        return result.rows[0];
    }

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

exports.saveUserSearch = async (userId, searchQuery, summary, articles) => {

    // mettre les id des articles dans une string au format x;x;x;
    console.log('---------articles:', articles);
    const articleIds = articles.map(a => a.id).join(';');

    const query = `
        INSERT INTO "user_research" ("user_id", "summary_article", "article_id", "user_research")
        VALUES ($1, $2, $3, $4)
        RETURNING "id"
        `;
    const values = [userId, summary, articleIds, searchQuery];
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
        throw new Error('Failed to save user search');
    }
    return result.rows[0].id;
}

exports.userSearchArticles = async(userId) => {
    const query = `
        SELECT "user_research", "summary_article", "article_id", "created_at"
        FROM "user_research"
        WHERE "user_id" = $1
        ORDER BY "created_at" DESC
        `;
    const values = [userId];
    const searchResult = await db.query(query, values);
    
    if (searchResult.rows.length === 0) {
        return {
            searches: [],
            articles: []
        };
    }
    
    // Get all unique article IDs from all searches
    const allArticleIds = searchResult.rows
        .map(row => row.article_id.split(';').filter(id => id && id.trim()))
        .flat()
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id));
    
    const uniqueArticleIds = [...new Set(allArticleIds)];
    
    let articlesMap = new Map();
    
    if (uniqueArticleIds.length > 0) {
        const articlesQuery = `
            SELECT "id", "title", "article", "date", "url", "provider"
            FROM "article_tab"
            WHERE "id" = ANY($1::int[])
            ORDER BY "date" DESC
        `;
        const articlesResult = await db.query(articlesQuery, [uniqueArticleIds]);
        
        // Create a map for quick article lookup
        articlesResult.rows.forEach(article => {
            articlesMap.set(article.id, article);
        });
    }
    
    // Process each search and attach its related articles
    const searchesWithArticles = searchResult.rows.map(search => {
        const articleIds = search.article_id
            .split(';')
            .filter(id => id && id.trim())
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));
        
        const relatedArticles = articleIds
            .map(id => articlesMap.get(id))
            .filter(article => article); // Remove undefined articles
        
        return {
            user_research: search.user_research,
            summary_article: search.summary_article,
            article_id: search.article_id,
            created_at: search.created_at,
            articles: relatedArticles // Add articles array to each search
        };
    });
    
    return {
        searches: searchesWithArticles
    };
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
    SELECT id, title, article, date, url,
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
    saveUserSearch: exports.saveUserSearch,
    userSearchArticles: exports.userSearchArticles,
    findArticlesByKeywords
};
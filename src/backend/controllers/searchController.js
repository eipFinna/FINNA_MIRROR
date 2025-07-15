// Handler API pour rechercher et résumer des articles
const { findArticlesByKeywords } = require('../services/dbService');
const aiService = require('../services/aiService'); // getKeywords, summarizeArticle, summarizeAggregate
const metricsService = require('../services/metricsService');

// On importe les métriques
const { keywordExtraction, dbQuery, totalIaBatch, summaryAggregate } = metricsService;

/**
 * Exécute la recherche et renvoie un objet { keywords, articles, summary }
 * @param {string} query — requête utilisateur
 * @param {number} maxArticles — nombre max d'articles à traiter
 * @returns {Promise<{ keywords: string[], articles: {title: string, summary: string}[], summary: string }>}
 */
async function searchAndSummarize(query, maxArticles = parseInt(process.env.MAX_ARTICLES || '5', 10)) {
    if (!query || typeof query !== 'string') {
        throw new Error('Paramètre "query" manquant ou invalide');
    }

    // 1. Extraction des mots-clés
    const endKeywords = keywordExtraction.startTimer();
    const keywords = await aiService.getKeywords(query);
    console.log('Mots-clés extraits :', keywords);
    endKeywords();

    // 2. Recherche full-text en base
    const endDbQuery = dbQuery.startTimer();
    const articles = await findArticlesByKeywords(keywords, maxArticles);
    console.log('Articles trouvés :', articles.length);
    // console.log('Détails des articles :', articles); # Commenté pour éviter trop de logs
    endDbQuery();

    // 3. Si aucun article pertinent
    if (articles.length === 0) {
        return {
        keywords,
        articles: [],
        summary: 'Aucun article pertinent trouvé.',
        };
    }

    // 4. Mini-résumé par article
    const endIaBatch = totalIaBatch.startTimer();
    const texts = articles.map(a => a.article);
    const summaries = await aiService.summarizeBatch(texts);

    // → On recompose l’objet renvoyé
    const perArticleSummaries = articles.map((art, i) => ({
      id: art.id,
      title: art.title,
      summary: summaries[i],
      date: art.date,
      url: art.url,
    }));
    console.log('Mini-résumés par article :', perArticleSummaries);
    endIaBatch();

    // 5. Agrégation des mini-résumés
    const startSummaryAggregate = summaryAggregate.startTimer();
    const toAggregate = perArticleSummaries.map(a => a.summary).join('\n\n');
    const globalSummary = await aiService.summarizeAggregate(toAggregate);
    startSummaryAggregate();

    console.log('Résumé global :', globalSummary);
    return {
        keywords,
        articles: perArticleSummaries,
        summary: globalSummary,
    };
}

/**
 * Express handler pour POST /search
 */
async function getSummarizedArticles(req, res, next) {
  try {
    const query = req.query.q || req.query.query || req.body.query;
    const result = await searchAndSummarize(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSummarizedArticles,
};

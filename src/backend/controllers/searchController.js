const aiService = require('../services/aiService');
const dbService = require('../services/dbService');

exports.search = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const keywords = await aiService.getKeywords(searchTerm);
        const results = await dbService.searchArticles(keywords);
        console.log('Résultats de la recherche :', results);
        res.json(results);
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        res.status(500).send('Une erreur est survenue.');
    }
};

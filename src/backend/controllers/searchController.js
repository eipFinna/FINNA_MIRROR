const dbService = require("../services/dbService");
const aiService = require("../services/aiService");

// Contrôleur pour rechercher les articles et produire un résumé global
exports.getSummarizedArticles = async (req, res) => {
    try {
        // Étape 1 : Rechercher les articles dans la base de données
        const searchTerm = req.query.q;
        const keywords = await aiService.getKeywords(searchTerm);
        console.log("Mots-clés extraits :", keywords);
        const articles = await dbService.searchArticles(keywords);
        console.log(articles);
        console.log("Articles trouvés :", articles.length);

        // Étape 2 : Concaténer les textes des articles
        const combinedText = articles.map(article => article.article).join("\n\n");
        if (!combinedText) {
            return res.status(404).json({ message: "Aucun article trouvé pour la recherche donnée." });
        }

        // Étape 3 : Générer le résumé global
        const summary = await aiService.summarizeWithPython(combinedText);

        // Étape 4 : Retourner le résumé au client
        res.json({ articles, summary });
        console.log("\n\n\n\nRésumé généré avec succès !\n");
        console.log(summary);
    } catch (error) {
        console.error("Erreur lors de la génération du résumé :", error);
        res.status(500).send("Une erreur est survenue lors de la génération du résumé.");
    }
};

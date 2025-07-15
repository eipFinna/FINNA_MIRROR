const { userSearchArticles } = require('../services/dbService');

async function pastUserSearch(req, res) {
    // get the id from the query parameters
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const result = await userSearchArticles(userId);
        console.log('User search result:', result);
        
        // Transform the data to match frontend expectations
        const formattedSearches = result.searches.map((search, index) => ({
            id: `search_${search.created_at}_${userId}_${index}`, // Create unique ID
            query: search.user_research,
            summary: search.summary_article,
            // Traiter le timestamp de la DB comme heure locale française
            timestamp: (() => {
                // Si c'est un string de la DB, on le traite comme heure locale française
                if (typeof search.created_at === 'string') {
                    let cleanTimestamp = search.created_at;
                    
                    // Enlever les microsecondes si présentes
                    if (cleanTimestamp.includes('.')) {
                        const parts = cleanTimestamp.split('.');
                        if (parts[1] && parts[1].length > 3) {
                            cleanTimestamp = parts[0] + '.' + parts[1].substring(0, 3);
                        }
                    }
                    
                    // Ajouter explicitement la timezone française (+02:00 en été)
                    return cleanTimestamp.replace(' ', 'T') + '+02:00';
                }
                
                // Si c'est déjà un objet Date, on ajoute 2h pour compenser
                const date = new Date(search.created_at);
                const adjustedDate = new Date(date.getTime() + (2 * 60 * 60 * 1000)); // +2h en millisecondes
                return adjustedDate.toISOString();
            })(),
            articleIds: search.article_id.split(';').filter(id => id && id.trim()),
            articles: search.articles || [] // Use articles from each search
        }));

        // Return the expected format with success flag
        res.status(200).json({
            success: true,
            searches: formattedSearches,
            articles: result.articles || [], // All unique articles for compatibility
            count: formattedSearches.length
        });
    } catch (error) {
        console.error('Error in userSearch:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
}

module.exports = {
    pastUserSearch
};
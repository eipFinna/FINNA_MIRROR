const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

export const searchArticles = async (query) => {
    const response = await fetch(API_BASE_URL + `/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch articles');
    }
    return response.json();
};

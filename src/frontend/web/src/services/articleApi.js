export const searchArticles = async (query) => {
    const response = await fetch(`/search?query=${query}`);
    if (!response.ok) {
        throw new Error('Failed to fetch articles');
    }
    return response.json();
    }

export const searchArticles = async (query, userId) => {
    const response = await fetch(`/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, userId })
    });
    if (!response.ok) {
        throw new Error('Failed to fetch articles');
    }
    return response.json();
};

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

export const getPastUserSearches = async (userId) => {
    const response = await fetch(`/userSearches?userId=${userId}`, { // Fixed: removed body from GET request
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Added for authentication
    });
    if (!response.ok) {
        throw new Error('Failed to fetch past user searches');
    }
    return response.json();
}
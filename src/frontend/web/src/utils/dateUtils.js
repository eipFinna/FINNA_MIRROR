export const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    
    // Vérifier si la date est valide
    if (isNaN(time.getTime())) {
        console.warn('Invalid timestamp:', timestamp);
        return timestamp;
    }
    
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    
    if (diffInSeconds < 30) return 'À l\'instant';
    if (diffInSeconds < 60) return `Il y a ${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)}min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`;
    
    return time.toLocaleDateString('fr-FR');
};

export const formatFullDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('fr-FR');
};

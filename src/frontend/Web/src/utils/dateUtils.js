export const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);

    
    if (isNaN(date)) return timestamp;
    
    const diffInSeconds = (date - now) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;
    const diffInMonths = (date.getFullYear() - now.getFullYear()) * 12 + 
                         (date.getMonth() - now.getMonth());
    const diffInYears = diffInMonths / 12;
    
    const formatter = new Intl.RelativeTimeFormat('fr', { 
        numeric: 'auto',
        style: 'long' 
    });

    if (Math.abs(diffInSeconds) < 60) {
        return formatter.format(Math.round(diffInSeconds), 'second');
    } else if (Math.abs(diffInMinutes) < 60) {
        return formatter.format(Math.round(diffInMinutes), 'minute');
    } else if (Math.abs(diffInHours) < 24) {
        return formatter.format(Math.round(diffInHours), 'hour');
    } else if (Math.abs(diffInDays) < 7) {
        return formatter.format(Math.round(diffInDays), 'day');
    } else if (Math.abs(diffInDays) < 30) {
        return formatter.format(Math.round(diffInDays / 7), 'week');
    } else if (Math.abs(diffInMonths) < 12) {
        return formatter.format(Math.round(diffInMonths), 'month');
    } else {
        return formatter.format(Math.round(diffInYears), 'year');
    }
};

export const formatFullDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    })} ${date.toLocaleTimeString()}`;
};

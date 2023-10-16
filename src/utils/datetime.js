const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const FormatChatMessageTime = (timestamp) => {
    timestamp = parseFloat(timestamp);
    console.log(timestamp);
    const now = new Date().getTime();
    const diff = now - timestamp;

    if (diff < 60000) {
        return `${Math.floor(diff / 1000)} seconds ago`;
    }

    if (diff < 3600000) {
        return `${Math.floor(diff / 60000)} minutes ago`;
    }

    if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)} hours ago`;
    }

    if (diff < 604800000) {
        const day = new Date(timestamp).getDay();
        const hour = new Date(timestamp).getHours();
        const minute = new Date(timestamp).getMinutes();
        return `${dayOfWeek[day]} ${(hour < 10 ? '0' : '') + hour}:${(minute < 10 ? '0' : '') + minute}`;
    }

    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}
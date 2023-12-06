import {nowRef} from '../globals'

const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const formatTimeDifference = (timestamp: string) => {
    const timestampParsed = parseFloat(timestamp);
    const diff = nowRef.value - timestampParsed;
    if (diff < 10000) {
        return 'Just now';
    }

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
        const day = new Date(timestampParsed).getDay();
        const hour = new Date(timestampParsed).getHours();
        const minute = new Date(timestampParsed).getMinutes();
        return `${dayOfWeek[day]} ${(hour < 10 ? '0' : '') + hour}:${(minute < 10 ? '0' : '') + minute}`;
    }

    const date = new Date(timestampParsed);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

export const formatChatMessageTime = (now: number, timestamp: number | string | undefined) => {
    if (timestamp === undefined) {
        return 'Just now';
    }
    timestamp = timestamp as string;
    const timestampParsed = parseFloat(timestamp);
    const minute = new Date(timestampParsed).getMinutes();
    const hour = new Date(timestampParsed).getHours();
    const day = new Date(timestampParsed).getDate();
    const month = new Date(timestampParsed).getMonth() + 1;
    const year = new Date(timestampParsed).getFullYear();
    const nowDate = new Date(now);
    const nowDay = nowDate.getDate();
    const nowMonth = nowDate.getMonth() + 1;
    const nowYear = nowDate.getFullYear();
    // if today, return time
    // if yesterday, return yesterday and time
    if (nowYear === year && nowMonth === month && nowDay === day) {
        return `${(hour < 10 ? '0' : '') + hour}:${(minute < 10 ? '0' : '') + minute}`;
    } else if (nowYear === year && nowMonth === month && nowDay === day + 1) {
        return `Yesterday ${(hour < 10 ? '0' : '') + hour}:${(minute < 10 ? '0' : '') + minute}`;

    } else {
        return `${year}/${month}/${day} ${(hour < 10 ? '0' : '') + hour}:${(minute < 10 ? '0' : '') + minute}`;
    }
}
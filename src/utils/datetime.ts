import {nowRef} from '../globals'

const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// TODO: complete typing of this whole file

export const FormatTimeDifference = (now, timestamp) => {
    timestamp = parseFloat(timestamp);
    const diff = nowRef.value - timestamp;
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

export const FormatChatMessageTime = (now, timestamp) => {
    timestamp = parseFloat(timestamp);
    const minute = new Date(timestamp).getMinutes();
    const hour = new Date(timestamp).getHours();
    const day = new Date(timestamp).getDate();
    const month = new Date(timestamp).getMonth() + 1;
    const year = new Date(timestamp).getFullYear();
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
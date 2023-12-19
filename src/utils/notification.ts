import {Message, MessageType} from "./structs";
import {DEBUG} from "../constants.ts";
import {userId} from "../globals.ts";

export const sendNotification = (message: Message) => {
    if (DEBUG) console.log("sending notification", message);
    if (window.Notification.permission === "granted") {
        let notificationBody = "";
        if (message.m_type === MessageType.TEXT) {
            notificationBody = message.content as string;
        } else if (message.m_type === MessageType.IMAGE) {
            notificationBody = "[image]";
        } else if (message.m_type === MessageType.AUDIO) {
            notificationBody = "[audio]";
        } else if (message.m_type === MessageType.VIDEO) {
            notificationBody = "[video]";
        } else if (message.m_type === MessageType.FILE) {
            notificationBody = "[file]";
        } else if (message.m_type === MessageType.STICKER) {
            notificationBody = "[sticker]";
        }
        let notificationTitle = "New Message!";
        // if somebody mentions you, notify that you are mentioned
        if (message.t_type === 1 && message.m_type === MessageType.TEXT) {
            if ((message.content as string).includes("@" + userId.value)) {
                notificationTitle = "You are mentioned!";
            }
        }
        new Notification(notificationTitle, {
            body: notificationBody,
            icon: "/Logo.png",
        })
    } else if (window.Notification.permission !== "denied") {
        window.Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                new Notification("Congratulations!", {
                    body: "Start chatting with your friends!",
                })
            }
        });
    }
}
export const displayHotMessage = (message: Message | undefined): string => {
    const types = ['text', 'image', 'audio', 'video', 'file', 'stickers'];
    if (message === undefined) {
        return '';
    } else if (message.m_type === MessageType.TEXT) {
        // 如果是多条消息转发，只显示第一条
        if (Array.isArray(message.content)) {
            return "[chat history]";
        }
        return message.content as string;
    } else {
        return '[' + types[message.m_type] + ']';
    }
}
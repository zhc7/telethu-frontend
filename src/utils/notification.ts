import {Message, MessageType} from "./structs";

export const sendNotification = (message: Message) => {
    console.log("sending notification", message);
    if (window.Notification.permission === "granted") {
        new Notification("New Message!", {
            body: message.content as string,
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
import {Message} from "./structs";

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
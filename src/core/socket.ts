import {BASE_WS_URL, DEBUG} from "../constants";
import {token} from "../auth";
import {contacts, isSocketConnected} from "../globals";
import {applyList, chatManager, dispatcher} from "./chat";
import {Ack, Message} from "../utils/structs";
import {contactInsert} from "./data.ts";

export let socket: WebSocket;
const createSocket = () => {
    let uri = BASE_WS_URL + "ws/chat?token=" + token.value;
    socket = new WebSocket(uri);

    let first = true;

    socket.onopen = () => {
        if (DEBUG) {
            console.log("WebSocket Client Connected");
            isSocketConnected.value = true;
        }
    };

    socket.onmessage = (e) => {
        const _message = JSON.parse(e.data);
        if (DEBUG)
            console.log('received message: ', _message);
        if (first) {
            console.log("receiving meta data", _message);
            const idList: Array<number> = _message as Array<number>;
            applyList();
            for (const id of idList) {
                let flag = true;
                contacts.value.forEach((entry) => {
                    if (entry === id) {
                        flag = false;
                    }
                });
                if (flag) {
                    contactInsert(id);
                }
            }
            first = false;
            return;
        }
        const message = _message as Message;
        chatManager.handle(message);
    };

    socket.onclose = (e) => {
        if (DEBUG) {
            console.log(
                "Socket is closed. Reconnection will be attempted in 1 second.",
                e.reason
            );
        }
        isSocketConnected.value = false;
        setTimeout(() => {
            createSocket();
        }, 1000);
    };

    socket.onerror = (err) => {
        console.error("Socket encountered error: ", err, "Closing socket");
        isSocketConnected.value = false;
        socket.close();
    };
}
export {createSocket};
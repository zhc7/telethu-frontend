import {BASE_WS_URL, DEBUG} from "../constants";
import {token} from "../auth";
import {contacts, isSocketConnected, settingsUpdating, unreadCounter} from "../globals";
import {chatManager} from "./chat";
import {Message} from "../utils/structs";
import {applyList} from "./users/send.ts";
import {getSettings} from "./data.ts";

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
            settingsUpdating.value = true;
            getSettings().then(() => {
                settingsUpdating.value = false;
            });
            applyList().then();
            contacts.value = idList;

            first = false;
            return;
        }
        const message = _message as Message;
        for (const id of contacts.value) {
            if (!message[id]) {
                message[id] = [];
            }
            if (!unreadCounter.value[id]) {
                unreadCounter.value[id] = 0;
            }
        }
        chatManager.handleMessage(message);
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
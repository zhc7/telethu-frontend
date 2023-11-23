import {BASE_WS_URL, DEBUG} from "../constants";
import {token} from "../auth";
import {contacts, isSocketConnected, messages} from "../globals";
import {chatManager, dispatcher} from "./chat";
import {Ack, Users, Message, UserData} from "../utils/structs";

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
            contacts.value = _message as Users;
            for (const contact of Object.values(contacts.value)) {
                if (!messages.value[contact.id]) {
                    messages.value[contact.id] = [];
                }
            }
            return;
        }
        const message = _message as Message;
        if (message.m_type === undefined) {
            // acknowledgement from RabbitMQ
            chatManager.receiveAck(message as Ack);
            return;
        }
        if (message.m_type <= 5) {
            // normal message or confirm message
            chatManager.receiveMessage(message);
            return;
        }
        dispatcher[message.m_type]!(message);
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
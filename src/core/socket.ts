import {BASE_WS_URL, DEBUG} from "../constants";
import {token} from "../auth";
import {contacts, isSocketConnected} from "../globals";
import {chatManager, dispatcher} from "./chat";
import {Ack, Users, Message} from "../utils/structs";

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
            handleLoad(_message as Users);
            first = false;
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
const handleLoad = (message: Users) => {
    // TODO: will be deprecated soon
    for (const contact of Object.values(message)) {
        if (contacts.value[contact.id] !== undefined) {
            contact.messages = contacts.value[contact.id].messages;
        }
        if (contact.messages === undefined) contact.messages = [];
        if (contact.category === "group") {
            contact.id2member = {}
            for (const member of contact.members) {
                contact.id2member[member.id] = member;
            }
        }
        contact.unread_counter = 0;
    }
    contacts.value = message;
}
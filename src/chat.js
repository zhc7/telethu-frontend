import {token} from "./auth.js";
import {BASE_WS_URL} from "./constants.js";
import {DEBUG} from "./constants.js";
import {ref} from "vue";
import {fakeContacts} from "./testdata/fakechats.js";

const contacts = ref(fakeContacts);

let socket;
// const messages = ref({});

const createSocket = (user_id) => {
    let uri = BASE_WS_URL + "ws/chat/" + user_id + "/";
    socket = new WebSocket(uri);

    socket.onopen = () => {
        if (DEBUG) {
            console.log("WebSocket Client Connected");
        }
    };

    socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        contacts.value[message.user_id].messages.push(message);
    };

    socket.onclose = (e) => {
        if (DEBUG) {
            console.log(
                "Socket is closed. Reconnect will be attempted in 1 second.",
                e.reason
            );
        }
        setTimeout(() => {
            socket = new WebSocket(uri);
        }, 1000);
    };

    socket.onerror = (err) => {
        console.error("Socket encountered error: ", err.message, "Closing socket");
        socket.close();
    };
}


const sendMessage = (receiverId, inputMessage) => {
    const message = {
        time: Date.now(),
        token: token.value,
        m_type: "text",
        content: inputMessage,
        receiver: receiverId,
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
};

export {sendMessage, contacts, createSocket}
import {token} from "./auth.js";
import {BASE_WS_URL} from "./constants.js";
import {DEBUG} from "./constants.js";
import {ref} from "vue";

let socket = new WebSocket(BASE_WS_URL);
const messages = ref({});

socket.onopen = () => {
    if (DEBUG) {
        console.log("WebSocket Client Connected");
    }
};

socket.onmessage = (e) => {
    const message = JSON.parse(e.data);
    messages.value[message.userId].push(message);
};

socket.onclose = (e) => {
    if (DEBUG) {
        console.log(
            "Socket is closed. Reconnect will be attempted in 1 second.",
            e.reason
        );
    }
    setTimeout(() => {
        socket = new WebSocket(BASE_WS_URL);
    }, 1000);
};

socket.onerror = (err) => {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    socket.close();
};

const sendMessage = (inputMessage) => {
    const message = {
        stamp: Date.now(),
        token: token.value,
        message: inputMessage.value,
    };
    socket.send(JSON.stringify(message));
};
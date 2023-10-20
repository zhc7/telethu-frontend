import {token, userId} from "./auth.js";
import {BASE_WS_URL, BASE_API_URL} from "./constants.js";
import {DEBUG} from "./constants.js";
import {ref} from "vue";
import {fakeContacts} from "./testdata/fakechats.js";
import axios from "axios";

const contacts = ref({});

let socket;
// const messages = ref({});

const addFriend = (friendId) => {
    axios.post(BASE_API_URL + "users/friends/apply", {friendId}, {
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        console.log("friend request sent");
    })
}

const acceptFriend = (friendId) => {
    axios.post(BASE_API_URL + "users/friends/accept", {friendId}, {
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        console.log("friend accepted");
    })
}

const getContacts = async () => {
    console.log("getting contacts");
    await axios.post(BASE_API_URL + "users/friends/list", {}, {
        headers: {
            Authorization: token.value,
        }
    })
        .then((response) => {
            if (DEBUG) {
                console.log(response.data);
            }
            let newContacts = {};
            for (let contact of response.data["friends"]) {
                newContacts[contact.id] = contact;
                console.log("contacts updated");
            }
            contacts.value = newContacts;
        })
}

const createSocket = () => {
    let uri = BASE_WS_URL + "ws/chat/" + userId.value + "/";
    socket = new WebSocket(uri);

    socket.onopen = () => {
        if (DEBUG) {
            console.log("WebSocket Client Connected");
        }
    };

    socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        console.log(message);
        contacts.value[message.sender].messages.push(message);
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
        m_type: "text",
        content: inputMessage,
        receiver: receiverId,
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
    contacts.value[receiverId].messages.push(message);
};

export {sendMessage, contacts, createSocket, getContacts, addFriend, acceptFriend}
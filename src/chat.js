import {token, userId} from "./auth.js";
import {BASE_WS_URL, BASE_API_URL} from "./constants.js";
import {DEBUG} from "./constants.js";
import {ref} from "vue";
import axios from "axios";

const contacts = ref({});
const friendRequests = ref([]);

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
    alert("calling deprecated get contact");
    console.log("getting contacts");
    await axios.get(BASE_API_URL + "users/friends/list", {
        headers: {
            Authorization: token.value,
        }
    })
        .then((response) => {
            if (DEBUG) {
                console.log(response.data);
            }
            const newContacts = {};
            for (let contact of response.data["friends"]) {
                newContacts[contact.id] = contact;
                console.log("contacts updated");
            }
            contacts.value = newContacts;
        })
}

const applyList = async () => {
    await axios.get(BASE_API_URL + "users/friends/apply_list", {
        headers: {
            Authorization: token.value,
        }
    })
        .then((response) => {
            if (DEBUG) {
                console.log(response.data);
            }
            const newRequests = {};
            for (let request of response.data["friends"]) {
                newRequests[request.id] = request;
                console.log("requests updated");
            }
            friendRequests.value = newRequests;
        });
}

const createSocket = () => {
    let uri = BASE_WS_URL + "ws/chat?token=" + token.value;
    socket = new WebSocket(uri);
    let first = true;

    socket.onopen = () => {
        if (DEBUG) {
            console.log("WebSocket Client Connected");
        }
    };

    socket.onmessage = (e) => {
        const message = JSON.parse(e.data);
        console.log(message);
        if (first) {
            // ignore friend meta, we'll manually get this by http for now
            console.log("receiving meta", message);
            first = false;
            contacts.value = message;
            for (let contact of Object.values(contacts.value)) {
                contact.messages = [];
                if (contact.category === "group") {
                    contact.id2member = {}
                    for (let member of contact.members) {
                        contact.id2member[member.id] = member;
                    }
                }
            }
        } else if (message.m_type <= 5) {
            if (message.t_type === 0) {
                contacts.value[message.sender].messages.push(message);
            } else if (message.t_type === 1) {
                contacts.value[message.receiver].messages.push(message);
            }
        } else {

        }
    };

    socket.onclose = (e) => {
        if (DEBUG) {
            console.log(
                "Socket is closed. Reconnection will be attempted in 1 second.",
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


const sendMessage = (receiverId, inputMessage, t_type) => {
    const message = {
        time: Date.now(),
        m_type: 0,
        t_type: t_type === undefined ? 0 : t_type,
        content: inputMessage,
        receiver: receiverId,
        sender: userId.value,
        info: "",
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
    contacts.value[receiverId].messages.push(message);
};

const createGroup = (groupName, members) => {
    const message = {
        time: Date.now(),
        m_type: 7,
        t_type: 1,
        content: members,
        receiver: userId.value,
        sender: userId.value,
        info: groupName,
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

export {
    contacts,
    friendRequests,
    sendMessage,
    createSocket,
    getContacts,
    applyList,
    addFriend,
    acceptFriend,
    createGroup,
}
import {token, userId} from "./auth.js";
import {BASE_WS_URL, BASE_API_URL} from "./constants.js";
import {DEBUG} from "./constants.js";
import {ref} from "vue";
import axios from "axios";
import {useLocalStorage} from "@vueuse/core";
import CryptoJS from 'crypto-js';

const contacts = useLocalStorage("contacts", {});
const friendRequests = ref([]);

let socket;
// const messages = ref({});


const generateMessageId = (content, sender, time) => {
    const data = `${content}${sender}${time}`;
    const hash = CryptoJS.SHA256(data);
    return hash.toString(CryptoJS.enc.Hex);
}

const Status = Object.freeze({
    sending: 'sending',
    sent: 'sent',
    read: 'read',
    failed: 'failed',
})

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

function sendNotification() {
    new Notification("新消息：", {
        body: "您有新的消息，请及时查看！",
    })
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
            for (let contact of Object.values(message)) {
                if (contacts.value[contact.id] !== undefined) {
                    contact.messages = contacts.value[contact.id].messages;
                }
                if (contact.messages === undefined) contact.messages = [];
                if (contact.category === "group") {
                    contact.id2member = {}
                    for (let member of contact.members) {
                        contact.id2member[member.id] = member;
                    }
                }
            }
            contacts.value = message;
        } else if (message.m_type === undefined) {
            // acknowledgement from RabbitMQ
            if (message.t_type === 0) {
                for (let msg of contacts.value[message.receiver].messages) {
                    if (msg.message_id === message.message_id) {
                        msg.status = Status.sent;
                        msg.message_id = message.reference;
                    }
                }
            }
        } else if (message.m_type <= 5) {
            // notification
            if (window.Notification.permission === "granted") {
                sendNotification();
            } else if (window.Notification.permission !== "denied") {
                window.Notification.requestPermission(function (permission) {
                    if (permission === "granted") {
                        sendNotification();
                    }
                });
            }

            if (message.t_type === 0) {
                contacts.value[message.sender].alert = true;
                contacts.value[message.sender].messages.push(message);
            } else if (message.t_type === 1) {
                contacts.value[message.sender].alert = true;
                contacts.value[message.receiver].messages.push(message);
            }
        } else {
            const functionMessageHandlers = {
                6: () => {
                    // FUNC_ADD_FRIEND
                },
                7: () => {
                    // FUNC_CREATE_GROUP
                    contacts.value[message.receiver] = message.content;
                },
                8: () => {
                    // FUNC_ADD_GROUP_MEMBER
                    contacts.value[message.receiver].members.push(message.content);
                    contacts.value[message.receiver].id2member[message.content.id] = message.content;
                }
            }
            functionMessageHandlers[message.m_type]();
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
        massage_id: generateMessageId(inputMessage, userId.value, Date.now()),
        status: Status.sending,
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
        message_id: generateMessageId(members.toString(), userId.value, Date.now()),
        status: Status.sending,
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

const groupAddMember = (groupId, memberId) => {
    const message = {
        time: Date.now(),
        m_type: 8,
        t_type: 1,
        content: groupId,
        sender: userId.value,
        receiver: memberId,
        info: "",
        message_id: generateMessageId(groupId, userId.value, Date.now()),
        status: Status.sending,
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

const getHistoryMessage = (id, from, t_type, num) => {
    axios.get(BASE_API_URL + "chat/history", {
        params: {
            id, from: 0, t_type, num: 10000,
        },
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        response.data.push(...contacts.value[id].messages);
        response.data.sort((a, b) => (a.time - b.time));
        let last_time = 0;
        let new_msg = [];
        for (let msg of response.data) {
            if (last_time !== msg.time) {
                new_msg.push(msg);
                last_time = msg.time;
            }
        }
        console.log(new_msg);
        contacts.value[id].messages = new_msg;
    })
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
    groupAddMember,
    getHistoryMessage,
}
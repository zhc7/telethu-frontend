import {token, user, userId} from "./auth.js";
import {BASE_WS_URL, BASE_API_URL} from "./constants.js";
import {DEBUG} from "./constants.js";
import {reactive, ref} from "vue";
import axios from "axios";
import {useLocalStorage} from "@vueuse/core";
import {generateMessageId, calculateMD5, generateMD5} from "./utils/hash.js";
import {upLoadFiles} from "./utils/uploadfiles.js";

const contacts = useLocalStorage("contacts", {});
const friendRequests = ref([]);

let socket;

const chatManager = {
    retryLimit: 3,
    timeout: 1,

    sentMessages: {},

    sendMessage(message) {
        console.log("sending message from manager", message);
        message.status = 'sending';
        message = reactive(message);
        if (message.m_type <= 5) {
            contacts.value[message.receiver].messages.push(message);
        }
        socket.send(JSON.stringify(message));

        // 设置一个超时时间，在这个时间内如果没有收到ack，则重新发送消息
        setTimeout(() => {
            if (message.status === 'sending') {
                this._retrySendMessage(message);
            }
        }, this.timeout * 1000);

        this.sentMessages[message.message_id] = message;
    },

    _retrySendMessage(message, attempts = 0) {
        if (message.status === 'sent') {
            return;
        }
        if (attempts >= this.retryLimit) {
            message.status = 'failed';
            return;
        }

        socket.send(JSON.stringify(message));

        setTimeout(() => {
            if (message.status === 'sending') {
                this._retrySendMessage(message, attempts + 1);
            }
        }, this.timeout * 1000);
    },

    receiveAck(ack) {
        console.log("received ack", ack);
        this._updateMessage(ack);
    },

    receiveMessage(message) {
        const target = message.t_type === 1 ? message.receiver :
            message.sender === user.value.id ? message.receiver : message.sender;
        let existing = contacts.value[target].messages.find((m) => m.message_id === message.message_id);
        if (existing === undefined) {
            message.status = 'sent';
            contacts.value[target].messages.push(message);
        } else {
            existing.status = 'sent';
            if (message.sender !== user.value.id && !contacts.value[target].muted) {
                sendNotification(message);
            }
        }
        const ack = {
            message_id: message.message_id,
        }
        console.log("sending ack", ack);
        socket.send(JSON.stringify(ack));
    },

    _updateMessage(ack) {
        const message = this.sentMessages[ack.reference];
        if (message === undefined) {
            return;
        }
        let messages = contacts.value[message.receiver].messages;
        const existing = messages.findIndex((m) => m.message_id === ack.reference);
        if (existing !== -1) {
            messages.splice(existing, 1);
        } else {
            message.status = 'sent';
            message.message_id = ack.message_id;
        }
    },
}

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

const sendNotification = (message) => {
    console.log("sending notification", message);
    if (window.Notification.permission === "granted") {
        new Notification("New Message!", {
            body: message.content,
            icon: "./public/DALL·E.png",
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
            chatManager.receiveAck(message);
        } else if (message.m_type <= 5) {
            // normal message or confirm message
            chatManager.receiveMessage(message);
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
                },
                14: () => {
                    // FUNC_DELETE_FRIEND
                    delete contacts.value[message.receiver];
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
        message_id: generateMessageId(inputMessage, userId.value, Date.now()),
        status: 'sending',
    };
    chatManager.sendMessage(message);
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
        status: 'sending',
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
        status: 'sending',
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

const getHistoryMessage = (id, from, t_type, num) => {
    axios.get(BASE_API_URL + "chat/history", {
        params: {
            id, from, t_type, num,
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

const deleteFriend = (friendId) => {
    const message = {
        m_type: 14,
        t_type: 0,
        time: Date.now(),
        message_id: generateMessageId(friendId, userId.value, Date.now()),
        content: "",
        receiver: friendId,
        sender: userId.value,
        info: "",
        status: 'sending',
    }
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

const blockFriend = (friendId) => {
    const message = {
        time: Date.now(),
        m_type: 13,
        t_type: 1,
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
        message_id: generateMessageId(friendId, userId.value, Date.now()),
        status: 'sending',
    }
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}
const unblockFriend = (friendId) => {
    const message = {
        time: Date.now(),
        m_type: 17,
        t_type: 1,
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
        message_id: generateMessageId(friendId, userId.value, Date.now()),
        status: 'sending',
    }
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

const sendFiles = async (receiverId, file, t_type, m_type) => {
    const md5 = await generateMD5(file);
    console.log("md5 -> ", md5);
    const message = {
        time: Date.now(),
        m_type: m_type,
        t_type: t_type,
        content: md5,
        receiver: receiverId,
        sender: userId.value,
        info: "",
        message_id: generateMessageId(file.name, userId.value, Date.now()),
        status: 'sending',
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
    };
    chatManager.sendMessage(message);
    return md5;
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
    deleteFriend,
    blockFriend,
    unblockFriend,
    sendFiles,
}
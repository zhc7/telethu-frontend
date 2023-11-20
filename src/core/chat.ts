import {token} from "../auth";
import {BASE_API_URL, DEBUG} from "../constants";
import {activeChatId, contacts, displayRightType, user, userId} from "../globals"
import {reactive, ref} from "vue";
import axios from "axios";
import {generateMD5, generateMessageId} from "../utils/hash";
import {formatFileSize, getFileType} from "./files";
import {socket} from "./socket";
import {sendNotification} from "../utils/notification";
import {Ack, GroupContact, GroupData, Message, MessageType, TargetType, UserData} from "../utils/structs";


const searchResult = ref();

const friendRequests = ref({});


// window.setInterval(() => {
//     for (const id of Object.keys(contacts.value)) {
//         getHistoryMessage(
//             +id,
//             Date.now(),
//             contacts.value[+id].category === "group" ? 1 : 0,
//             1000,
//         )
//     }
// }, 20000);

const chatManager: {
    retryLimit: number,
    timeout: number,
    sentMessages: { [id: string]: Message },
    sendMessage: (message: Message) => void,
    _retrySendMessage: (message: Message, attempts?: number) => void,
    receiveAck: (ack: Ack) => void,
    receiveMessage: (message: Message) => void,
    _updateMessage: (ack: Ack) => void,
} = {
    retryLimit: 3,
    timeout: 1,

    sentMessages: {},

    sendMessage(message: Message) {
        console.log("sending message from manager", message);
        message.status = 'sending';
        message = reactive(message);
        if (message.m_type <= 5) {
            contacts.value[message.receiver].messages.push(message);
        }
        socket.send(JSON.stringify(message));

        // set a timeout. If ack not received in given time, then resend.
        setTimeout(() => {
            if (message.status === 'sending') {
                this._retrySendMessage(message);
            }
        }, this.timeout * 1000);

        this.sentMessages[message.message_id as string] = message;
    },

    _retrySendMessage(message: Message, attempts = 0) {
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

    receiveAck(ack: Ack) {
        if (DEBUG) {
            // console.log("received ack", ack);
        }
        this._updateMessage(ack);
    },

    receiveMessage(message: Message) {
        const target = message.t_type === 1 ? message.receiver :
            message.sender === user.value.id ? message.receiver : message.sender;
        let existing = contacts.value[target].messages.find((m: Message) => m.message_id === message.message_id);
        if (existing === undefined) {
            message.status = 'sent';
            contacts.value[target].messages.push(message);
            if (message.sender !== user.value.id && !contacts.value[target].muted) {
                sendNotification(message);
            }
            if (activeChatId.value !== message.sender && user.value.id === message.receiver) {
                contacts.value[target].unread_counter += 1;
            }
        } else if (existing.status === 'sending') {
            existing.status = 'sent';
        }
        const ack: Ack = {
            message_id: message.message_id as number,
        }
        console.log("receive message and send ack", ack);
        socket.send(JSON.stringify(ack));
    },

    _updateMessage(ack: Ack) {
        const message = this.sentMessages[ack.reference as string];
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

const addFriend = (friendId: number) => {
    axios.post(BASE_API_URL + "users/friends/apply", {friendId}, {
        headers: {
            Authorization: token.value,
        }
    }).then(() => {
        console.log("friend request sent");
    })
};

const acceptFriend = (friendId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: 11,
        t_type: 1,
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
        message_id: generateMessageId(friendId, userId.value, Date.now()),
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
};

const rejectFriend = (friendId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: 12,
        t_type: 1,
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
        message_id: generateMessageId(friendId, userId.value, Date.now()),
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
};

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


const handleAddFriend = (message: Message) => {
    console.log('received add friend request');
    console.log(message);
    // FUNC_ADD_FRIEND
};
const handleCreateGroup = (message: Message) => {
    // FUNC_CREATE_GROUP
    let groupData = message.content as GroupData;
    let group = groupData as GroupContact;
    const members = [];
    group.messages = [];
    console.log('group members', message.content);
    for (const id in groupData.members) {
        let memberInfo: UserData = {
            id: +id,
            name: 'Me',
            avatar: '/download.jpeg',
            email: "",
            category: "user",
        }   // TODO @sjh: I'm not quite sure what's the purpose of this
        if (contacts.value[id] !== undefined) {
            memberInfo = contacts.value[id] as UserData;
        }
        members.push(memberInfo);
    }
    group.members = members;
    contacts.value[group.id] = group;
    console.log('group info', contacts.value[group.id]);
};
const handleAddGroupMember = (message: Message) => {
    // FUNC_ADD_GROUP_MEMBER
    let group = contacts.value[message.receiver] as GroupContact;
    let user = message.content as UserData;
    group.members.push(user);
    group.id2member[user.id as number] = user;
};
const handleDeleteFriend = (message: Message) => {
    // FUNC_DELETE_FRIEND
    // const message = {
    //     time: Date.now(),
    //     m_type: 14,
    //     t_type: 1,
    //     content: "",
    //     sender: userId.value,
    //     receiver: friendId,
    //     info: "",
    //     message_id: generateMessageId(friendId, userId.value, Date.now()),
    // };
    // console.log(JSON.stringify(message));
    // socket.send(JSON.stringify(message));
    delete contacts.value[message.receiver];
};
const handleReceiveRequest = (message: Message) => {
    console.log("code 10 received: ", message);
}

const handleSearchResult = (message: Message) => {
    // message.content.mute = false;
    console.log(message.content);
    searchResult.value = message.content;
    displayRightType.value = "searchResult";
}

const receiveReadMessage = (message: Message) => {
    console.log("read message", message);
    let target = [message.sender, message.receiver][message.t_type];
    let m = contacts.value[target].messages.find(m => m.message_id === message.content);
    if (m === undefined) {
        // TODO: handle this properly
    }
    m = m as Message;
    if (m.sender !== user.value.id) {
        console.log("error receive read:", target, m, "not send by this user");
        return;
    }
    m.status = "read";
}

const dispatcher = {
    6: handleAddFriend,
    7: handleCreateGroup,
    8: handleAddGroupMember,
    10: handleReceiveRequest,
    14: handleDeleteFriend,
    18: handleSearchResult,
    19: receiveReadMessage,
}


const sendMessage = (receiverId: number, inputMessage: string, t_type: TargetType) => {
    const message: Message = {
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

const createGroup = (groupName: string, members: Array<number>) => {
    const message: Message = {
        time: Date.now(),
        m_type: 7,
        t_type: 1,
        content: {
            members,
            category: "group",
            name: groupName,
            avatar: "",
        },
        receiver: userId.value,
        sender: userId.value,
        info: groupName,
        message_id: generateMessageId(members.toString(), userId.value, Date.now()),
        status: 'sending',
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

const groupAddMember = (groupId: number, memberId: number) => {
    const message: Message = {
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

const searchForFriend = (friendId: number) => {
    const message: Message = {
        m_type: 18,
        t_type: 1,
        time: Date.now(),
        message_id: generateMessageId(friendId, userId.value, Date.now()),
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
    }
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}


const getHistoryMessage = (id: number, from: number, t_type: TargetType, num: number) => {
    axios.get(BASE_API_URL + "chat/history", {
        params: {
            id, from, t_type, num,
        },
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        response.data.push(...contacts.value[id].messages);
        response.data.sort((a: Message, b: Message) => (a.time - b.time));
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

const deleteFriend = (friendId: number) => {
    const message: Message = {
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

const blockFriend = (friendId: number) => {
    const message: Message = {
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
const unblockFriend = (friendId: number) => {
    const message: Message = {
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

const sendFiles = async (receiverId: number, file: File, t_type: TargetType, m_type: MessageType) => {
    const md5 = await generateMD5(file);
    console.log("md5 -> ", md5);
    const message: Message = {
        time: Date.now(),
        m_type: m_type,
        t_type: t_type,
        content: md5,
        receiver: receiverId,
        sender: userId.value,
        info: file.name + "/" + formatFileSize(file.size) + "/" + getFileType(file.name),
        message_id: generateMessageId(file.name, userId.value, Date.now()),
        status: 'sending',
    };
    chatManager.sendMessage(message);
    return md5;
}

const sendReadMessage = (id: number) => {
    const message: Message = {
        message_id: generateMessageId(id.toString(), userId.value, Date.now()),
        time: Date.now(),
        m_type: 19,
        t_type: 1,
        content: id,
        sender: -1,
        receiver: -1,
    }
    chatManager.sendMessage(message);
}

export {
    friendRequests,
    searchResult,
    displayRightType,
    chatManager,
    dispatcher,
    sendMessage,
    applyList,
    addFriend,
    acceptFriend,
    rejectFriend,
    createGroup,
    groupAddMember,
    getHistoryMessage,
    deleteFriend,
    blockFriend,
    unblockFriend,
    searchForFriend,
    sendFiles,
    sendReadMessage,
}
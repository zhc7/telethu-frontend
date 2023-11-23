import {token} from "../auth";
import {BASE_API_URL, DEBUG} from "../constants";
import {rawChatList, contacts, displayRightType, hotMessages, messages, settings, user, userId} from "../globals"
import {reactive, ref} from "vue";
import axios from "axios";
import {generateMD5, generateMessageId} from "../utils/hash";
import {formatFileSize, getFileType} from "./files";
import {socket} from "./socket";
import {sendNotification} from "../utils/notification";
import {Ack, GroupData, Message, MessageType, TargetType, UserData} from "../utils/structs";
import {getCache, getUser} from "./data.ts";


const searchResult = ref();

const friendRequests = ref<Array<number>>([]);


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
            messages.value[message.receiver].push(message);
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
        let existing = messages.value[target].find((m: Message) => m.message_id === message.message_id);
        if (existing === undefined) {
            message.status = 'sent';
            hotMessages.value[message.receiver] = {
                sender: message.receiver,
                time: message.time,
                content: message.content,
            };

            messages.value[target].push(message);
            if (message.sender !== user.value.id && !settings.value.muted.includes(target)) {
                sendNotification(message);
            }
            if (message.sender !== user.value.id) {
                hotMessages.value[message.receiver] = {
                    sender: message.sender,
                    time: message.time,
                    content: message.content,
                };
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
        console.log("messages", messages, "message", message);
        let old_messages = messages.value[message.receiver];
        const existing = old_messages.findIndex((m) => m.message_id === ack.reference);
        if (existing !== -1) {
            old_messages.splice(existing, 1);
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

const parse_Avatar = (arrayBuffer: ArrayBuffer) => {
    if (!arrayBuffer) return '/Shenium.png';
    const blob = new Blob([arrayBuffer], {type: 'image/jpeg'});
    return URL.createObjectURL(blob);
}

export const updateChatList = async () => {
    const list = [];
    for (const id of contacts.value) {
        console.log('filling in chatInfo', id);
        const contact = await getUser(id);
        const chatInfo = {
            id: id,
            name: contact.name,
            avatar: contact.avatar,
            avatar_storage: parse_Avatar(await getCache(contact.avatar)),
            category: contact.category,
            unread_counter: 0,
            pin: settings.value.pinned.includes(id),
            mute: settings.value.muted.includes(id),
            block: settings.value.blocked.includes(id),
        }
        list.push(chatInfo);
    }
    rawChatList.value = list;
}

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
    // TODO: change this func according to new data structure
    // TODO: DO NOT access contacts directly
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
    getUser(message.receiver).then((group) => {
        let user = message.content as number;
        (group as GroupData).members.push(user);
    })
};

const handleSomebodyExitGroup = (message) => {
    const memberId = message.sender;
    const groupId = message.receiver;
    if (contacts.value.indexOf(groupId) === -1) {
        return;
    }
    if (memberId === user.value.id) {
        contacts.value = contacts.value.filter((i) => i !== groupId);
        delete messages.value[groupId];
        rawChatList.value = rawChatList.value.filter((i) => i.id !== groupId);
    }
}

const deleteFriend = (id: number) => {
    const message = {
        time: Date.now(),
        m_type: 14,
        t_type: 1,
        content: "",
        sender: userId.value,
        receiver: id,
        info: "",
        message_id: generateMessageId(id, userId.value, Date.now()),
    };
    alert('delete');
    console.log('deleting friend', JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

const handleDeleteFriend = (message: Message) => {
    // FUNC_DELETE_FRIEND
    if (contacts.value.indexOf(message.receiver) === -1) {
        return;
    }
    delete messages.value[message.receiver];
    contacts.value = contacts.value.filter((i: number) => i !== message.receiver);
    rawChatList.value = rawChatList.value.filter((i) => i.id !== message.receiver);
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
    let m = messages.value[target].find(m => m.message_id === message.content);
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

const dispatcher: {[key in MessageType]?: (arg0: Message) => void} = {}
dispatcher[MessageType.FUNC_CREATE_GROUP] = handleCreateGroup;
dispatcher[MessageType.FUNC_ADD_GROUP_MEMBER] = handleAddGroupMember;
dispatcher[MessageType.FUNC_EXIT_GROUP] = () => {};
dispatcher[MessageType.FUNC_APPLY_FRIEND] = handleReceiveRequest;
dispatcher[MessageType.FUNC_ACCEPT_FRIEND] = () => {}; // TODO
dispatcher[MessageType.FUNC_REJECT_FRIEND] = () => {}; // TODO
dispatcher[MessageType.FUNC_BlOCK_FRIEND] = () => {}; // TODO
dispatcher[MessageType.FUNC_DEL_FRIEND] = handleDeleteFriend;

dispatcher[MessageType.FUNC_UPDATE_SETTINGS] = () => {}; // TODO
dispatcher[MessageType.FUNC_UNBLOCK_FRIEND] = () => {}; // TODO
dispatcher[MessageType.FUN_SEND_META] = handleSearchResult;
dispatcher[MessageType.FUNC_READ_MESSAGE] = receiveReadMessage;
dispatcher[MessageType.FUNC_SB_EXIT_GROUP] = handleSomebodyExitGroup;


const sendMessage = (receiverId: number, inputMessage: string, t_type: TargetType) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.TEXT,
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
            id: 0,  // place holder
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

const exitGroup = (id: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: 20,
        t_type: 1,
        receiver: id,
        content: '',
        sender: userId.value,
        info: '',
        message_id: generateMessageId(id, userId.value, Date.now()),
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
        response.data.push(...messages.value[id]);
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
        messages.value[id] = new_msg;
    })
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

const sendReadMessage = (id: number | string) => {
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
    exitGroup,
    groupAddMember,
    getHistoryMessage,
    deleteFriend,
    blockFriend,
    unblockFriend,
    searchForFriend,
    sendFiles,
    sendReadMessage,
}
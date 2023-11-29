import {Message, MessageType, TargetType} from "../../utils/structs.ts";
import {
    activeRequestId,
    contactPageProfileSource,
    messages,
    requests,
    selectedContactInfo,
    user,
    userId
} from "../../globals.ts";
import {generateMD5, generateMessageId} from "../../utils/hash.ts";
import {socket} from "../socket.ts";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "../../constants.ts";
import {token} from "../../auth.ts";
import {contactInsert, requestInsert, requestRemove} from "../data.ts";
import {formatFileSize, getFileType} from "../files.ts";
import {chatManager} from "../chat.ts";

const addFriend = (friendId: number) => {
    const message = {
        time: Date.now(),
        m_type: 10,
        t_type: 1,
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
        message_id: generateMessageId(friendId, userId.value, Date.now()),
    }
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
};
const acceptFriend = async (friendId: number) => {
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
    await contactInsert(friendId);
    requestRemove(friendId);
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
    activeRequestId.value = 0;
    if (selectedContactInfo.value && selectedContactInfo.value.id === friendId) {
        selectedContactInfo.value = undefined;
    }
    requestRemove(friendId);
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
            const idList = response.data['friends'];
            console.log(response.data);
            for (const request of idList) {
                requestInsert(request.id, {
                    id: request.id,
                    name: request.name,
                    email: request.email,
                    avatar: request.avatar,
                    time: request.time,
                });
            }
            console.log('requests', requests.value);
        });
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
    console.log('deleting friend', JSON.stringify(message));
    socket.send(JSON.stringify(message));
}
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
            owner: user.value.id,
            admin: [],
        },
        receiver: userId.value,
        sender: userId.value,
        info: groupName,
        message_id: generateMessageId(members.toString(), userId.value, Date.now()),
        status: 'sending',
    };
    console.log('create message sending: ', JSON.stringify(message));
    socket.send(JSON.stringify(message));
}
const searchForFriend = async (friendId: number) => {
    const result = await axios.post(BASE_API_URL + 'users/user_search', {
        type: 0,
        info: friendId,
    }, {
        headers: {
            Authorization: token.value,
        }
    });
    selectedContactInfo.value = result.data.users[0];
    contactPageProfileSource.value = 'searchResult';
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
const readMessage = (mid: number) => {
    const message: Message = {
        message_id: generateMessageId('' + mid, userId.value, Date.now()),
        time: Date.now(),
        m_type: 19,
        t_type: 1,
        content: mid,
        sender: -1,
        receiver: -1,
    }
    chatManager.sendMessage(message);
}
export {readMessage};
export {sendFiles};
export {unblockFriend};
export {blockFriend};
export {getHistoryMessage};
export {searchForFriend};
export {createGroup};
export {sendMessage};
export {deleteFriend};
export {applyList};
export {rejectFriend};
export {acceptFriend};
export {addFriend};
import {Message, MessageType, TargetType} from "../../utils/structs";
import {
    activeRequestId,
    contactPageProfileSource,
    contacts,
    referencingMessageId,
    requests,
    searchedId,
    selectedContactInfo,
    userId
} from "../../globals";
import {generateMD5, generateMessageId} from "../../utils/hash";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "../../constants";
import {token} from "../../auth";
import {requestInsert, requestRemove} from "../data";
import {formatFileSize, getFileType} from "../files";
import {chatManager} from "../chat";

const applyFriend = (friendId: number) => {
    const message = {
        time: Date.now(),
        m_type: MessageType.FUNC_APPLY_FRIEND,
        t_type: TargetType.FRIEND,
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
        message_id: generateMessageId(friendId, userId.value, Date.now()),
    }
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
};

const acceptFriend = async (friendId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_ACCEPT_FRIEND,
        t_type: TargetType.FRIEND,
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
        message_id: generateMessageId(friendId, userId.value, Date.now()),
    };
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
    contacts.value.push(friendId);
    requestRemove(friendId);
};

const rejectFriend = (friendId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_REJECT_FRIEND,
        t_type: TargetType.FRIEND,
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
    chatManager.sendMessage(message);
};

const applyList = async () => {
    await axios.get(BASE_API_URL + "users/friends/apply_list", {
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        if (DEBUG) {
            console.log('apply_list', response.data);
        }
        const idList = response.data.list;
        console.log(response.data);
        for (const request of idList) {
            requestInsert(request.id);
        }
        console.log('requests', requests.value);
    });
}

const deleteFriend = (id: number) => {
    const message = {
        time: Date.now(),
        m_type: MessageType.FUNC_DEL_FRIEND,
        t_type: TargetType.FRIEND,
        content: "",
        sender: userId.value,
        receiver: id,
        info: "",
        message_id: generateMessageId(id, userId.value, Date.now()),
    };
    console.log('deleting friend', JSON.stringify(message));
    chatManager.sendMessage(message);
}
const sendMessage = (receiverId: number, inputMessage: string, t_type: TargetType) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.TEXT,
        t_type: t_type === undefined ? 0 : t_type,
        content: inputMessage,
        receiver: receiverId,
        sender: userId.value,
        info: {
            reference: referencingMessageId.value,
        },
        message_id: generateMessageId(inputMessage, userId.value, Date.now()),
        pending_status: 'sending',
        who_read: t_type === TargetType.FRIEND ? false : [],
    };
    chatManager.sendMessage(message);
};
const searchForFriend = async (friendId: number) => {
    const result = await axios.post(BASE_API_URL + 'users/user_search', {
        type: 0,
        info: friendId,
    }, {
        headers: {
            Authorization: token.value,
        }
    });
    searchedId.value = result.data.users[0].id;
    contactPageProfileSource.value = 'searchResult';
}
const blockFriend = (friendId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_BlOCK_FRIEND,
        t_type: TargetType.FRIEND,
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
        message_id: generateMessageId(friendId, userId.value, Date.now()),
        pending_status: 'sending',
    }
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}
const unblockFriend = (friendId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_UNBLOCK_FRIEND,
        t_type: TargetType.FRIEND,
        content: "",
        sender: userId.value,
        receiver: friendId,
        info: "",
        message_id: generateMessageId(friendId, userId.value, Date.now()),
        pending_status: 'sending',
    }
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
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
        pending_status: 'sending',
    };
    chatManager.sendMessage(message);
    return md5;
}
const readMessage = (mid: number) => {
    const message: Message = {
        message_id: generateMessageId('' + mid, userId.value, Date.now()),
        time: Date.now(),
        m_type: MessageType.FUNC_READ_MESSAGE,
        t_type: TargetType.FRIEND,
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
export {searchForFriend};
export {sendMessage};
export {deleteFriend};
export {applyList};
export {rejectFriend};
export {acceptFriend};
export {applyFriend};
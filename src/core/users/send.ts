import {Message, MessageType, TargetType} from "../../utils/structs";
import {
    activeChatId,
    activeRequestId,
    contacts,
    requests,
    searchResults,
    selectedContactInfo,
    user,
    userId
} from "../../globals";
import {generateMessageId} from "../../utils/hash";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "../../constants";
import {token} from "../../auth";
import {requestRemove} from "../data";
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
    if (DEBUG) console.log(JSON.stringify(message));
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
    if (DEBUG) console.log(JSON.stringify(message));
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
    if (DEBUG) console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
};

const applyList = async () => {
    await axios.get(BASE_API_URL + "users/friends/apply_list", {
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        if (DEBUG) console.log('apply_list', response.data);
        requests.value = response.data.list;
        if (DEBUG) console.log('get request list', response.data.list);

        if (DEBUG) console.log('requests', requests.value);
    });
}

const deleteFriend = (id: number) => {
    if (activeChatId.value === id) {
        activeChatId.value = 0;
    }
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
    if (DEBUG) console.log('deleting friend', JSON.stringify(message));
    chatManager.sendMessage(message);
}
const searchForFriend = async (info: number | string) => {
    const result = await axios.post(BASE_API_URL + 'users/user_search', {
        type: 0,
        info: info,
    }, {
        headers: {
            Authorization: token.value,
        }
    });
    searchResults.value = result.data.users;
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
    if (DEBUG) console.log(JSON.stringify(message));
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
    if (DEBUG) console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}
const readMessage = (mid: number, receiver: number, t_type: TargetType) => {
    const message: Message = {
        message_id: generateMessageId('' + mid, userId.value, Date.now()),
        time: Date.now(),
        m_type: MessageType.FUNC_READ_MESSAGE,
        t_type,
        content: mid,
        sender: user.value.id,
        receiver,
    }
    chatManager.sendMessage(message);
}

export const killSocket = () => {
    const message: Message = {
        time: Date.now(),
        m_type: 99,
        t_type: 99,
        content: "",
        sender: userId.value,
        receiver: 0,
        info: "",
        message_id: generateMessageId(1, userId.value, Date.now()),
        pending_status: 'sending',
    }
    if (DEBUG) console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}

export {readMessage};
export {unblockFriend};
export {blockFriend};
export {searchForFriend};
export {deleteFriend};
export {applyList};
export {rejectFriend};
export {acceptFriend};
export {applyFriend};
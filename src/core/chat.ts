import {BASE_API_URL, DEBUG} from "../constants";
import {hotMessages, messages, settings, unreadCounter, user} from "../globals"
import {reactive, ref} from "vue";
import {socket} from "./socket";
import {sendNotification} from "../utils/notification";
import {Ack, Message, MessageType, TargetType} from "../utils/structs";
import {
    handleAddGroupMember,
    handleCreateGroup,
    handleGroupAdminAdded,
    handleGroupAdminRemoved, handleGroupOwnerChanged,
    handleSomebodyExitGroup,
    handleSomebodyRemovedFromGroup
} from "./groups/receive.ts";
import {
    handleApplicationAccepted, handleBlockFriend,
    handleDeleteFriend,
    handleReceiveMessageRead,
    handleReceiveRequest,
    handleSearchResult, handleUnblockFriend
} from "./users/receive.ts";
import axios from "axios";
import {token} from "../auth.ts";
import {handleDeleteMessage, handleRecallMessage} from "./messages/receive.ts";
import {getUser} from "./data.ts";
import {updateUserProfile} from "./users/profile.ts";


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
    sentMessages: {
        [id: string]: Message
    },
    sendMessage: (message: Message) => void,
    _retrySendMessage: (message: Message, attempts?: number) => void,
    handleMessage: (message: Message) => void,
    receiveAck: (ack: Ack) => void,
    receiveMessage: (message: Message) => void,
    _updateMessage: (ack: Ack) => void,
} = {
    retryLimit: 3,
    timeout: 1,

    sentMessages: {},

    sendMessage(message: Message) {
        console.log("sending message from manager", message);
        message.pending_status = 'sending';
        message = reactive(message);
        if (message.m_type <= 5) {
            messages.value[message.receiver].push(message);
        }
        socket.send(JSON.stringify(message));

        // set a timeout. If ack not received in given time, then resend.
        setTimeout(() => {
            if (message.pending_status === 'sending') {
                this._retrySendMessage(message);
            }
        }, this.timeout * 1000);

        this.sentMessages[message.message_id as string] = message;
    },

    _retrySendMessage(message: Message, attempts = 0) {
        if (message.pending_status === 'sent') {
            return;
        }
        if (attempts >= this.retryLimit) {
            message.pending_status = 'failed';
            return;
        }

        socket.send(JSON.stringify(message));

        setTimeout(() => {
            if (message.pending_status === 'sending') {
                this._retrySendMessage(message, attempts + 1);
            }
        }, this.timeout * 1000);
    },

    handleMessage(message: Message) {
        if (message.m_type === undefined) {
            // acknowledgement from RabbitMQ
            this.receiveAck(message as Ack);
            return;
        }
        if (message.m_type <= 5) {
            // normal message or confirm message
            this.receiveMessage(message);
        } else {
            dispatcher[message.m_type]!(message);
        }
        const ack: Ack = {
            message_id: message.message_id as number,
        }
        console.log("receive message and send ack", ack);
        socket.send(JSON.stringify(ack));
    },

    receiveAck(ack: Ack) {
        if (DEBUG) {
            // console.log("received ack", ack);
        }
        this._updateMessage(ack);
    },

    receiveMessage(message: Message) {
        const target = message.t_type === TargetType.GROUP ? message.receiver :
            message.sender === user.value.id ? message.receiver : message.sender;
        hotMessages.value[target] = {
            sender: message.receiver,
            time: message.time,
            content: message,
        };
        let existing = messages.value[target].find((m: Message) => m.message_id === message.message_id);
        if (existing === undefined) {
            message.pending_status = 'sent';
            if (message.sender !== user.value.id) {
                unreadCounter.value[target] += 1;
            }
            messages.value[target].push(message);
            if (message.sender !== user.value.id && !settings.value.muted.includes(target)) {
                sendNotification(message);
            }
        } else if (existing.pending_status === 'sending') {
            existing.pending_status = 'sent';
        }
    },

    _updateMessage(ack: Ack) {
        const message = this.sentMessages[ack.reference as string];
        if (message === undefined) {
            return;
        }
        message.pending_status = 'sent';
        message.message_id = ack.message_id;
        if (message.m_type < MessageType.FUNCTION) {
            let old_messages = messages.value[message.receiver];
            console.log('get old_message', old_messages);
            const existing = old_messages.findIndex((m) => m.message_id === ack.reference);
            if (existing !== -1) {
                old_messages.splice(existing, 1);
            }
        }
    },
}

const getHistoryMessage = async (id: number, from: number, t_type: TargetType, num: number) => {
    console.log("pulling from: ", from);
    return axios.get(BASE_API_URL + "chat/history", {
        params: {
            id, from, t_type, num,
        },
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        const pulled_messages = response.data as Array<Message>;
        const pulled_length = pulled_messages.length;
        // sort and merge
        pulled_messages.push(...messages.value[id]);
        pulled_messages.sort((a: Message, b: Message) => (a.time - b.time));
        // deduplicate
        let last_time = 0;
        const new_msg: Array<Message> = [];
        for (let msg of response.data) {
            if (last_time !== msg.time) {
                new_msg.push(msg);
                last_time = msg.time;
            }
        }
        console.log(new_msg);
        messages.value[id] = new_msg;
        if (new_msg.length) {
            hotMessages.value[id] = {
                sender: id,
                time: messages.value[id][messages.value[id].length - 1].time,
                content: messages.value[id][messages.value[id].length - 1],
            };
        }
        return pulled_length;
    });
}

const updateReceiverInfo = (msg: Message) => {
    const updated = getUser(msg.receiver, true);
    console.log("updated receiver info", updated);
}


const dispatcher: { [key in MessageType]?: (arg0: Message) => void } = {}
dispatcher[MessageType.FUNC_CREATE_GROUP] = handleCreateGroup;
dispatcher[MessageType.FUNC_ADD_GROUP_MEMBER] = handleAddGroupMember;
dispatcher[MessageType.FUNC_RECALL_SELF_MESSAGE] = handleRecallMessage;
dispatcher[MessageType.FUNC_APPLY_FRIEND] = handleReceiveRequest;
dispatcher[MessageType.FUNC_ACCEPT_FRIEND] = handleApplicationAccepted;
dispatcher[MessageType.FUNC_REJECT_FRIEND] = () => {
}; // TODO
dispatcher[MessageType.FUNC_BlOCK_FRIEND] = handleBlockFriend;
dispatcher[MessageType.FUNC_DEL_FRIEND] = handleDeleteFriend;
dispatcher[MessageType.FUNC_CHANGE_GROUP_OWNER] = handleGroupOwnerChanged;
dispatcher[MessageType.FUNC_UPDATE_SETTINGS] = () => {
}; // TODO
dispatcher[MessageType.FUNC_UNBLOCK_FRIEND] = handleUnblockFriend;
dispatcher[MessageType.FUN_SEND_META] = handleSearchResult;
dispatcher[MessageType.FUNC_READ_MESSAGE] = handleReceiveMessageRead;
dispatcher[MessageType.FUNC_LEAVE_GROUP] = handleSomebodyExitGroup;
dispatcher[MessageType.FUNC_ADD_GROUP_ADMIN] = handleGroupAdminAdded;
dispatcher[MessageType.FUNC_REMOVE_GROUP_ADMIN] = handleGroupAdminRemoved;
dispatcher[MessageType.FUNC_REMOVE_GROUP_MEMBER] = handleSomebodyRemovedFromGroup;
dispatcher[MessageType.FUNC_DELETE_MESSAGE] = handleDeleteMessage;
dispatcher[MessageType.FUNC_MESSAGE_ADD_BROADCAST] = updateReceiverInfo;
dispatcher[MessageType.FUNC_MESSAGE_DEL_BROADCAST] = updateReceiverInfo;
dispatcher[MessageType.FUNC_EDIT_PROFILE] = updateUserProfile;


export {
    friendRequests,
    searchResult,
    chatManager,
    dispatcher,
    getHistoryMessage,
}

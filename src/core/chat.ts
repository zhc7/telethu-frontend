import {DEBUG} from "../constants";
import {hotMessages, messageDict, messages, settings, unreadCounter, user} from "../globals"
import {reactive, ref} from "vue";
import {socket} from "./socket";
import {sendNotification} from "../utils/notification";
import {Ack, Message, MessageType, TargetType} from "../utils/structs";
import {
    handleAddGroupMember,
    handleCandidateRejected,
    handleCreateGroup,
    handleGroupAdminAdded,
    handleGroupAdminRemoved,
    handleGroupDismissed,
    handleGroupNameChanged,
    handleGroupOwnerChanged,
    handleSomebodyExitGroup,
    handleSomebodyRemovedFromGroup
} from "./groups/receive.ts";
import {
    handleApplicationAccepted,
    handleBlockFriend,
    handleDeleteFriend,
    handleReceiveRequest,
    handleSearchResult,
    handleUnblockFriend
} from "./users/receive.ts";
import {handleDeleteMessage, handleRecallMessage, updateMessage} from "./messages/receive.ts";
import {getUser} from "./data.ts";
import {updateUserProfile} from "./users/profile.ts";
import {initMessageBlock, messageBlocks, sortBlock} from "./blocks.ts";
import {callSnackbar} from "../utils/snackbar.ts";


const searchResult = ref();

const friendRequests = ref<Array<number>>([]);


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
        if (DEBUG) console.log("sending message from manager", message);
        message.pending_status = 'sending';
        message = reactive(message);
        if (message.m_type <= 5) {
            messageDict.value[message.message_id] = message;
            const blocks = messageBlocks.value[message.receiver];
            blocks[blocks.length - 1].messages.push(message.message_id);
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
        if (DEBUG) console.log("receive message and send ack", ack);
        socket.send(JSON.stringify(ack));
    },

    receiveAck(ack: Ack) {
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
        if (messages.value[target] === undefined) {
            messages.value[target] = [];
        }
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
        initMessageBlock(target);
        const blocks = messageBlocks.value[target];
        const block = blocks[blocks.length - 1];
        messageDict.value[message.message_id] = message;
        block.messages.push(message.message_id);
        sortBlock(block);
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
            if (DEBUG) console.log('get old_message', old_messages);
            const existing = old_messages.findIndex((m) => m.message_id === ack.reference);
            if (existing !== -1) {
                old_messages.splice(existing, 1);
            }
            const blocks = messageBlocks.value[message.receiver];
            const block = blocks[blocks.length - 1];
            const index = block.messages.findIndex(id => id === ack.reference);
            block.messages[index] = ack.message_id;
        }
    },
}

const updateReceiverInfo = (msg: Message) => {
    const updated = getUser(msg.receiver, true);
    if (DEBUG) console.log("updated receiver info", updated);
}


const dispatcher: { [key in MessageType]?: (arg0: Message) => void } = {}
dispatcher[MessageType.FUNC_CREATE_GROUP] = handleCreateGroup;
dispatcher[MessageType.FUNC_ADD_GROUP_MEMBER] = handleAddGroupMember;
dispatcher[MessageType.FUNC_RECALL_SELF_MESSAGE] = handleRecallMessage;
dispatcher[MessageType.FUNC_APPLY_FRIEND] = handleReceiveRequest;
dispatcher[MessageType.FUNC_ACCEPT_FRIEND] = handleApplicationAccepted;
dispatcher[MessageType.FUNC_REJECT_FRIEND] = (message) => {
    callSnackbar(`You are rejected by user ${getUser(message.sender).name}`, "info");
};
dispatcher[MessageType.FUNC_BlOCK_FRIEND] = handleBlockFriend;
dispatcher[MessageType.FUNC_DEL_FRIEND] = handleDeleteFriend;
dispatcher[MessageType.FUNC_CHANGE_GROUP_OWNER] = handleGroupOwnerChanged;
dispatcher[MessageType.FUNC_UPDATE_SETTINGS] = () => {};
dispatcher[MessageType.FUNC_UNBLOCK_FRIEND] = handleUnblockFriend;
dispatcher[MessageType.FUN_SEND_META] = handleSearchResult;
dispatcher[MessageType.FUNC_READ_MESSAGE] = updateMessage;
dispatcher[MessageType.FUNC_LEAVE_GROUP] = handleSomebodyExitGroup;
dispatcher[MessageType.FUNC_ADD_GROUP_ADMIN] = handleGroupAdminAdded;
dispatcher[MessageType.FUNC_REMOVE_GROUP_ADMIN] = handleGroupAdminRemoved;
dispatcher[MessageType.FUNC_REMOVE_GROUP_MEMBER] = handleSomebodyRemovedFromGroup;
dispatcher[MessageType.FUNC_DELETE_MESSAGE] = handleDeleteMessage;
dispatcher[MessageType.FUNC_MESSAGE_ADD_BROADCAST] = updateReceiverInfo;
dispatcher[MessageType.FUNC_MESSAGE_DEL_BROADCAST] = updateReceiverInfo;
dispatcher[MessageType.FUNC_RECALL_MEMBER_MESSAGE] = handleRecallMessage;
dispatcher[MessageType.FUNC_EDIT_PROFILE] = updateUserProfile;
dispatcher[MessageType.FUNC_GROUP_CHANGE_NAME] = handleGroupNameChanged;
dispatcher[MessageType.FUNC_GROUP_DISMISS] = handleGroupDismissed;
dispatcher[MessageType.FUNC_REPLY] = updateMessage;
dispatcher[MessageType.FUNC_REJECT_CANDIDATE] = handleCandidateRejected;


export {
    friendRequests,
    searchResult,
    chatManager,
    dispatcher,
}

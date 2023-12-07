import {Message, MessageType, TargetType} from "../../utils/structs";
import {chatManager} from "../chat";
import {generateMessageId} from "../../utils/hash";
import {user} from "../../globals";

export const forwardMessage = (messageId: number | Array<number>, receiver: number) => {
    const newMessage: Message = {
        message_id: generateMessageId(messageId, receiver, Date.now()),
        m_type: MessageType.TEXT,
        t_type: TargetType.FRIEND,
        content: "forward",
        info: messageId,
        receiver,
        sender: user.value.id,
        time: Date.now(),
    };
    chatManager.sendMessage(newMessage);
}

export const recallMessage = (messageId: number, receiver: number, t_type: TargetType) => {
    const newMessage: Message = {
        message_id: generateMessageId(messageId, user.value.id, Date.now()),
        m_type: MessageType.FUNC_RECALL_SELF_MESSAGE,
        t_type,
        content: messageId,
        receiver,
        sender: user.value.id,
        time: Date.now(),
    };
    chatManager.sendMessage(newMessage);
}

export const deleteMessage = (messageId: number, receiver: number, t_type: TargetType) => {
    const newMessage: Message = {
        message_id: generateMessageId(messageId, user.value.id, Date.now()),
        m_type: MessageType.FUNC_DELETE_MESSAGE,
        t_type,
        content: messageId,
        receiver,
        sender: user.value.id,
        time: Date.now(),
    };
    chatManager.sendMessage(newMessage);
}
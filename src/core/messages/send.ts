import {Message, MessageType, TargetType} from "../../utils/structs";
import {chatManager} from "../chat";
import {generateMessageId} from "../../utils/hash";
import {user} from "../../globals";
import {getUser} from "../data.ts";

export const forwardMessage = (msg: Message | Array<Message>, receiver: number) => {
    const newMessage: Message = {
        message_id: generateMessageId(msg, receiver, Date.now()),
        m_type: msg.constructor === Array ? MessageType.TEXT : (msg as Message).m_type,
        t_type: getUser(receiver).category === "user" ? TargetType.FRIEND : TargetType.GROUP,
        content: msg.constructor === Array ? msg : (msg as Message).content,
        receiver,
        sender: user.value.id,
        time: Date.now(),
    };
    if (msg.constructor !== Array && (msg as Message).m_type === MessageType.TEXT) {
        // change to md quote by line
        newMessage.content = "*Forwarded from " + user.value.name + "@" + user.value.id + "*\n\n"
        newMessage.content += ((msg as Message).content as string).split("\n").map((line: string) => "> " + line).join("\n");
    }
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

export const pinMessage = (messageId: number, receiver: number) => {
    const newMessage: Message = {
        message_id: generateMessageId(messageId, user.value.id, Date.now()),
        m_type: MessageType.FUNC_MESSAGE_ADD_BROADCAST,
        t_type: TargetType.GROUP,
        content: messageId,
        receiver,
        sender: user.value.id,
        time: Date.now(),
    };
    chatManager.sendMessage(newMessage);
}
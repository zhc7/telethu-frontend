import {Message, MessageType, TargetType} from "../../utils/structs";
import {chatManager} from "../chat";
import {generateMD5, generateMessageId} from "../../utils/hash";
import {referencingMessageId, user, userId} from "../../globals";
import {getUser} from "../data.ts";
import {DEBUG} from "../../constants.ts";
import {formatFileSize, getFileType} from "../files.ts";

export const forwardMessage = (msg: Message | Array<Message>, receiver: number) => {
    const newMessage: Message = {
        message_id: generateMessageId(msg, receiver, Date.now()),
        m_type: msg.constructor === Array ? MessageType.TEXT : (msg as Message).m_type,
        t_type: getUser(receiver).category === "user" ? TargetType.FRIEND : TargetType.GROUP,
        content: msg.constructor === Array ? msg : (msg as Message).content,
        info: msg.constructor === Array ? undefined : (msg as Message).info,
        receiver,
        sender: user.value.id,
        time: Date.now(),
    };
    if (msg.constructor !== Array && (msg as Message).m_type === MessageType.TEXT && typeof (msg as Message).content === "string") {
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

export const unpinMessage = (messageId: number, receiver: number) => {
    const newMessage: Message = {
        message_id: generateMessageId(messageId, user.value.id, Date.now()),
        m_type: MessageType.FUNC_MESSAGE_DEL_BROADCAST,
        t_type: TargetType.GROUP,
        content: messageId,
        receiver,
        sender: user.value.id,
        time: Date.now(),
    };
    chatManager.sendMessage(newMessage);
}

export const sendMessage = (receiverId: number, inputMessage: string, t_type: TargetType) => {
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
    };
    chatManager.sendMessage(message);
};

export const sendFiles = async (receiverId: number, file: File, t_type: TargetType, m_type: MessageType) => {
    const md5 = await generateMD5(file);
    if (DEBUG) console.log("md5 -> ", md5);
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
};

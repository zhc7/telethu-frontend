import {Message} from "../utils/structs.ts";
import {rawChatList, userId} from "../globals.ts";
import {generateMessageId} from "../utils/hash.ts";
import {socket} from "./socket.ts";

export const groupChangeOwner = (groupId, memberId) => {
    const message: Message = {
        time: Date.now(),
        m_type: 15,
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

export const handleGroupOwnerChanged = (message) => {
    const entry = rawChatList.value.filter((i) => i.id === message.content)[0];
    if (entry === undefined) return;
    entry.owner = message.receiver;
    console.log('Group owner of group-', message.content, 'changed to', message.receiver);
}

export const groupAddAdmin = (groupId: number, memberId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: 21,
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

export const handleGroupAdminAdded = (message: Message) => {
    const entry = rawChatList.value.filter((i) => i.id === message.content)[0];
    if (entry === undefined) return;
    entry.admin.push(message.receiver);
    console.log(`Admin${message.receiver} added to ${message.content}`);
}

export const groupRemoveAdmin = (groupId, memberId) => {
    const message: Message = {
        time: Date.now(),
        m_type: 22,
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

export const handleGroupAdminRemoved = (message: Message) => {
    const entry = rawChatList.value.filter((i) => i.id === message.content)[0];
    if (entry === undefined) return;
    entry.admin.filter((i) => i.id !== message.receiver);
    console.log(`Admin${message.receiver} removed from ${message.content}`);
}

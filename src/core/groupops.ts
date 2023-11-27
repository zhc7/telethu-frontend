import {GroupData, Message, UserData} from "../utils/structs.ts";
import {contacts, messages, rawChatList, user, userId} from "../globals.ts";
import {generateMessageId} from "../utils/hash.ts";
import {socket} from "./socket.ts";
import {contactInsert, getUser} from "./data.ts";

export const handleCreateGroup = (message: Message) => {
    contactInsert(message.content.id);
};

export const handleAddGroupMember = (message: Message) => {
    // FUNC_ADD_GROUP_MEMBER
    getUser(message.receiver).then((group) => {
        let user = message.content as number;
        (group as GroupData).members.push(user);
    })
};

export const handleSomebodyExitGroup = (message) => {
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

export const groupChangeOwner = (groupId: number, memberId: number) => {
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

export const handleGroupOwnerChanged = (message: Message) => {
    const entry = rawChatList.value.filter((i) => i.id === message.content)[0];
    if (entry === undefined) return;
    if (entry.owner === message.receiver) return;
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
    if (entry.admin.includes(message.receiver)) return;
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

export const groupAddMember = (groupId: number, memberId: number) => {
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

export const handleMemberAddedToGroup = (message) => {
}
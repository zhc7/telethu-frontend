import {Message, MessageType} from "../utils/structs";
import {userId} from "../globals";
import {generateMessageId} from "../utils/hash";
import {socket} from "./socket";
import {contactInsert, contactRemove, contactUpdate} from "./data.ts";

export const handleCreateGroup = (message: Message) => {
    contactInsert(message.content.id);
};

export const handleAddGroupMember = (message: Message) => {
    // FUNC_ADD_GROUP_MEMBER
    contactUpdate(message.receiver);
    console.log('member added');
};

export const exitGroup = (id: number | undefined) => {
    if (id === undefined) {
        return;
    }
    const message: Message = {
        time: Date.now(),
        m_type: 20,
        t_type: 1,
        receiver: id,
        content: '',
        sender: userId.value,
        info: '',
        message_id: generateMessageId(id, userId.value, Date.now()),
        status: 'sending',
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

export const handleSomebodyExitGroup = (message) => {
    const memberId = message.sender;
    const groupId = message.receiver;
    if (memberId === userId.value) {
        contactRemove(groupId)
    }
    else {
        contactUpdate(groupid);
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
    const groupId = message.content;
    contactUpdate(groupId);
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
    contactUpdate(message.content);
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
    const groupId = message.content;
    contactUpdate(groupId);
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

export const removeGroupMember = (groupId: number, memberId: number) => {
    const message = {
        time: Date.now(),
        m_type: MessageType.FUNC_SB_REMOVED_FROM_GROUP,
        t_type: 1,
        content: groupId,
        sender: userId.value,
        receiver: memberId,
        info: "",
        message_id: generateMessageId(memberId, userId.value, Date.now()),
    };
    console.log('kicking member', JSON.stringify(message));
    socket.send(JSON.stringify(message));
}

export const handleSomebodyRemovedFromGroup = (message: Message) => {
    const groupId = message.content;
    contactUpdate(groupId);
}

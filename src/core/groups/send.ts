import {Message, MessageType} from "../../utils/structs.ts";
import {userId} from "../../globals.ts";
import {generateMessageId} from "../../utils/hash.ts";
import {socket} from "../socket.ts";

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
export const groupRemoveAdmin = (groupId: number, memberId: number) => {
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
export const groupAddMember = (groupId: number, memberList: number []) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_ADD_GROUP_MEMBER,
        t_type: 1,
        content: {
            members: memberList,
            category: 'group',
            name: '',
            avatar: '',
        },
        sender: userId.value,
        receiver: groupId,
        info: "",
        message_id: generateMessageId(groupId, userId.value, Date.now()),
        status: 'sending',
    };
    console.log(JSON.stringify(message));
    socket.send(JSON.stringify(message));
}
export const removeGroupMember = (groupId: number, memberId: number) => {
    alert('yesyes');
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
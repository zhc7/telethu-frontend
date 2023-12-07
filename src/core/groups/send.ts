import {Message, MessageType, TargetType} from "../../utils/structs";
import {userId} from "../../globals";
import {generateMessageId} from "../../utils/hash";
import {chatManager} from "../chat";

export const exitGroup = (id: number | undefined) => {
    if (id === undefined) {
        return;
    }
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_LEAVE_GROUP,
        t_type: TargetType.FRIEND,
        receiver: id,
        content: '',
        sender: userId.value,
        info: '',
        message_id: generateMessageId(id, userId.value, Date.now()),
        status: 'sending',
    };
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}
export const groupChangeOwner = (groupId: number, memberId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_CHANGE_GROUP_OWNER,
        t_type: TargetType.FRIEND,
        content: groupId,
        sender: userId.value,
        receiver: memberId,
        info: "",
        message_id: generateMessageId(groupId, userId.value, Date.now()),
        status: 'sending',
    };
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}
export const groupAddAdmin = (groupId: number, memberId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_ADD_GROUP_ADMIN,
        t_type: TargetType.FRIEND,
        content: groupId,
        sender: userId.value,
        receiver: memberId,
        info: "",
        message_id: generateMessageId(groupId, userId.value, Date.now()),
        status: 'sending',
    };
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}
export const groupRemoveAdmin = (groupId: number, memberId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_REMOVE_GROUP_ADMIN,
        t_type: TargetType.FRIEND,
        content: groupId,
        sender: userId.value,
        receiver: memberId,
        info: "",
        message_id: generateMessageId(groupId, userId.value, Date.now()),
        status: 'sending',
    };
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}
export const groupAddMember = (groupId: number, memberList: number []) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_ADD_GROUP_MEMBER,
        t_type: TargetType.FRIEND,
        content: {
            members: memberList,
            category: 'group',
            name: '',
            avatar: '',
            admin: [-1],
            id: -1,
            owner: -1,
        },
        sender: userId.value,
        receiver: groupId,
        info: "",
        message_id: generateMessageId(groupId, userId.value, Date.now()),
        status: 'sending',
    };
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}
export const removeGroupMember = (groupId: number, memberId: number) => {
    const message = {
        time: Date.now(),
        m_type: MessageType.FUNC_REMOVE_GROUP_MEMBER,
        t_type: TargetType.FRIEND,
        content: groupId,
        sender: userId.value,
        receiver: memberId,
        info: "",
        message_id: generateMessageId(memberId, userId.value, Date.now()),
    };
    console.log('kicking member', JSON.stringify(message));
    chatManager.sendMessage(message);
}
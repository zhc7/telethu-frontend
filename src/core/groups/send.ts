import {Message, MessageType, TargetType} from "../../utils/structs";
import {activeChatId, user, userId} from "../../globals";
import {generateMessageId} from "../../utils/hash";
import {chatManager} from "../chat";
import {DEBUG} from "../../constants.ts";

export const exitGroup = (id: number | undefined) => {
    if (id === undefined) {
        return;
    }
    if (activeChatId.value === id) {
        activeChatId.value = -1;
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
        pending_status: 'sending',
    };
    if (DEBUG) console.log(JSON.stringify(message));
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
        pending_status: 'sending',
    };
    if (DEBUG) console.log(JSON.stringify(message));
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
        pending_status: 'sending',
    };
    if (DEBUG) console.log(JSON.stringify(message));
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
        pending_status: 'sending',
    };
    if (DEBUG) console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}
export const groupAddMember = (groupId: number, memberList: number []) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_ADD_GROUP_MEMBER,
        t_type: TargetType.GROUP,
        content: memberList,
        sender: userId.value,
        receiver: groupId,
        info: "",
        message_id: generateMessageId(groupId, userId.value, Date.now()),
        pending_status: 'sending',
    };
    if (DEBUG) console.log(JSON.stringify(message));
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
    if (DEBUG) console.log('kicking member', JSON.stringify(message));
    chatManager.sendMessage(message);
}
export const createGroup = (groupName: string, members: Array<number>) => {
    if (groupName === '') {
        groupName = "new group";
    }
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_CREATE_GROUP,
        t_type: TargetType.FRIEND,
        content: {
            members,
            category: "group",
            name: groupName,
            avatar: "",
            id: 0,  // placeholder
            owner: user.value.id,
            admin: [],
        },
        receiver: userId.value,
        sender: userId.value,
        info: groupName,
        message_id: generateMessageId(members.toString(), userId.value, Date.now()),
        pending_status: 'sending',
    };
    if (DEBUG) console.log('Creating group: ', JSON.stringify(message));
    chatManager.sendMessage(message);
}

export const changeGroupName = (groupId: number, newName: string) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_GROUP_CHANGE_NAME,
        t_type: TargetType.FRIEND,
        content: newName,
        receiver: groupId,
        sender: userId.value,
        message_id: generateMessageId(newName, userId.value, Date.now()),
        pending_status: 'sending',
    };
    if (DEBUG) console.log('Changing group name: ', JSON.stringify(message));
    chatManager.sendMessage(message);
}
export const dismissGroup = (groupId: number) => {
    if (activeChatId.value === groupId) {
        activeChatId.value = 0;
    }
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_GROUP_DISMISS,
        t_type: TargetType.FRIEND,
        content: groupId,
        receiver: groupId,
        sender: userId.value,
        message_id: generateMessageId(groupId, userId.value, Date.now()),
        pending_status: 'sending',
    };
    if (DEBUG) console.log('Dismissing group: ', JSON.stringify(message));
    chatManager.sendMessage(message);
}

export const rejectCandidate = (groupId: number, personId: number) => {
    const message: Message = {
        time: Date.now(),
        m_type: MessageType.FUNC_REJECT_CANDIDATE,
        t_type: TargetType.GROUP,
        content: personId,
        receiver: groupId,
        sender: userId.value,
        message_id: generateMessageId(groupId, userId.value, Date.now()),
        pending_status: 'sending',
    };
    if (DEBUG) console.log('Dismissing group: ', JSON.stringify(message));
    chatManager.sendMessage(message);
}
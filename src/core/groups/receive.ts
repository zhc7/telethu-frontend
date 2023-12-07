import {GroupData, Message} from "../../utils/structs.ts";
import {contacts, userId} from "../../globals.ts";
import {getUser} from "../data.ts";

export const handleAddGroupMember = (message: Message) => {
    // FUNC_ADD_GROUP_MEMBER
    getUser(message.receiver, true);
    console.log('member added');
};
export const handleSomebodyExitGroup = (message: Message) => {
    const memberId = message.sender;
    const groupId = message.receiver;
    if (memberId === userId.value) {
        contacts.value = contacts.value.filter(id => id !== groupId);
    } else {
        getUser(groupId, true);
    }
}
export const handleGroupOwnerChanged = (message: Message) => {
    const groupId = message.content as number;
    getUser(groupId, true);
}
export const handleGroupAdminAdded = (message: Message) => {
    getUser(message.content as number, true);
}
export const handleGroupAdminRemoved = (message: Message) => {
    const groupId = message.content as number;
    getUser(groupId, true);
}
export const handleSomebodyRemovedFromGroup = (message: Message) => {
    const groupId = message.receiver as number;
    getUser(groupId, true);
}
export const handleCreateGroup = (message: Message) => {
    alert(message.content);
    contacts.value.push(message.content);
};
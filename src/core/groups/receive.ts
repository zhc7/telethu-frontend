import {Message} from "../../utils/structs.ts";
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
    const content = message.content;
    if (content === +content) {
        getUser(content as number, true);
    } else {
        alert(content);
        console.log('in group add admin', message);
    }
}
export const handleGroupAdminAdded = (message: Message) => {
    const content = message.content;
    if (content === +content) {
        getUser(content as number, true);
    } else {
        alert(content);
        console.log('in group add admin', message);
    }
}
export const handleGroupAdminRemoved = (message: Message) => {
    const content = message.content;
    if (content === +content) {
        getUser(content, true);
    } else {
        alert(content);
    }
}
export const handleSomebodyRemovedFromGroup = (message: Message) => {
    const content = message.content;
    if (content === +content) {
        getUser(content, true);
    } else {
        alert(content);
    }
}
export const handleCreateGroup = (message: Message) => {
    const content = message.content;
    if (content === +content) {
        if (!contacts.value.includes(content)) {
            contacts.value.push(content);
        }
    } else {
        alert(content);
    }
};
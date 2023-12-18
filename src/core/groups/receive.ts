import {Message} from "../../utils/structs.ts";
import {contacts, userId} from "../../globals.ts";
import {getCandidateList, getUser} from "../data.ts";
import {DEBUG} from "../../constants.ts";
import {callSnackbar} from "../../utils/snackbar.ts";

export const handleAddGroupMember = (message: Message) => {
    if (DEBUG) console.log('adding member to group', message);
    // FUNC_ADD_GROUP_MEMBER
    getUser(message.receiver, true);
    getCandidateList(message.receiver).then();
    if (DEBUG) console.log('member added');
    callSnackbar('new group member', 'info');
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
export const handleCandidateRejected = (message: Message) => {
    getCandidateList(message.receiver).then();
}
export const handleGroupOwnerChanged = (message: Message) => {
    const content = message.content;
    if (content === +content) {
        getUser(content as number, true);
        callSnackbar('group owner changed', 'info');
    } else {
        callSnackbar(content as string, 'error');
        if (DEBUG) console.log('in group add admin', message);
    }
}
export const handleGroupAdminAdded = (message: Message) => {
    const content = message.content;
    if (content === +content) {
        getUser(content as number, true);
    } else {
        callSnackbar(content as string, 'error');
        if (DEBUG) console.log('in group add admin', message);
    }
}
export const handleGroupAdminRemoved = (message: Message) => {
    const content = message.content;
    if (content === +content) {
        getUser(content, true);
    } else {
        callSnackbar(content as string, 'error');
    }
}
export const handleSomebodyRemovedFromGroup = (message: Message) => {
    const content = message.content;
    if (content === +content) {
        getUser(content, true);
    } else {
        callSnackbar(content as string, 'error');
    }
}
export const handleCreateGroup = (message: Message) => {
    const content = message.content;
    if (content === +content) {
        if (!contacts.value.includes(content)) {
            contacts.value.push(content);
            callSnackbar('new group created', 'info');
        }
    } else {
        callSnackbar(content as string, 'error');
    }
};

export const handleGroupDismissed = (message: Message) => {
    const groupId = message.content;
    if (groupId === +groupId) {
        contacts.value = contacts.value.filter(i => i !== groupId);
        callSnackbar('group dismissed', 'info');
    } else {
        callSnackbar("group " + groupId as string + " dismiss failed", 'error');
    }
}

export const handleGroupNameChanged = (message: Message) => {
    const groupId = message.receiver;
    if (groupId === +groupId) {
        getUser(groupId, true);
    } else {
        alert(groupId);
    }
}
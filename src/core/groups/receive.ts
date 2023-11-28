import {GroupData, Message} from "../../utils/structs.ts";
import {userId} from "../../globals.ts";
import {contactInsert, contactRemove, contactUpdate} from "../data.ts";

export const handleAddGroupMember = (message: Message) => {
    // FUNC_ADD_GROUP_MEMBER
    contactUpdate(message.receiver);
    console.log('member added');
};
export const handleSomebodyExitGroup = (message: Message) => {
    const memberId = message.sender;
    const groupId = message.receiver;
    if (memberId === userId.value) {
        contactRemove(groupId)
    } else {
        contactUpdate(groupId);
    }
}
export const handleGroupOwnerChanged = (message: Message) => {
    const groupId = message.content as number;
    contactUpdate(groupId);
}
export const handleGroupAdminAdded = (message: Message) => {
    contactUpdate(message.content as number);
}
export const handleGroupAdminRemoved = (message: Message) => {
    const groupId = message.content as number;
    contactUpdate(groupId);
}
export const handleSomebodyRemovedFromGroup = (message: Message) => {
    const groupId = message.content as number;
    contactUpdate(groupId);
}
export const handleCreateGroup = (message: Message) => {
    contactInsert((message.content as GroupData).id);
};
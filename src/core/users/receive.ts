import {ContactsData, Message} from "../../utils/structs.ts";
import {contactPageProfileSource, messages, selectedContactInfo, user} from "../../globals.ts";
import {applyList} from "./send";
import {contactInsert, contactRemove} from "../data.ts";

export const handleDeleteFriend = (message: Message) => {
    contactRemove(message.sender);
    contactRemove(message.receiver)
};
export const handleReceiveRequest = async (_: Message) => {
    await applyList();
}
export const handleApplicationAccepted = (message: Message) => {
    contactInsert(message.sender);
    contactInsert(message.receiver);
}
export const handleSearchResult = (message: Message) => {
    // message.content.mute = false;
    console.log(message.content);
    selectedContactInfo.value = message.content as ContactsData;
    contactPageProfileSource.value = "searchResult";
}
export const handleReceiveMessageRead = (message: Message) => {
    console.log("read message", message);
    let target = [message.sender, message.receiver][message.t_type];
    let m = messages.value[target].find(m => m.message_id === message.content);
    if (m === undefined) {
        // TODO: handle this properly
    }
    m = m as Message;
    if (m.sender !== user.value.id) {
        console.log("error receive read:", target, m, "not send by this user");
        return;
    }
    m.status = "read";
}
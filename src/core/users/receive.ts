import {ContactsData, Message} from "../../utils/structs.ts";
import {contactPageProfileSource, contacts, selectedContactInfo, user} from "../../globals.ts";
import {applyList} from "./send";
import {getBlackList} from "../data.ts";
import {DEBUG} from "../../constants.ts";

export const handleDeleteFriend = (message: Message) => {
    contacts.value = contacts.value.filter(id => id !== message.sender && id !== message.receiver);
}

export const handleReceiveRequest = async () => {
    await applyList();
}

export const handleBlockFriend = () => {
    getBlackList().then();
}

export const handleApplicationAccepted = (message: Message) => {
    if (message.sender === user.value.id) {
        if (!contacts.value.includes(message.receiver)) {
            contacts.value.push(message.receiver);
        }
    } else {
        if (!contacts.value.includes(message.sender)) {
            contacts.value.push(message.sender);
        }
    }
}

export const handleSearchResult = (message: Message) => {
    if (DEBUG) console.log(message.content);
    selectedContactInfo.value = message.content as ContactsData;
    contactPageProfileSource.value = "searchResult";
}

export const handleUnblockFriend = () => {
    getBlackList().then();
}
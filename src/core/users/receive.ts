import {ContactsData, Message} from "../../utils/structs.ts";
import {contactPageProfileSource, contacts, messages, selectedContactInfo, user} from "../../globals.ts";
import {applyList} from "./send";
import {getBlackList} from "../data.ts";
import {getAsyncMessage} from "../messages/receive.ts";
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

export const handleReceiveMessageRead = (message: Message) => {
    if (DEBUG) console.log("read message", message);
    let target = [message.sender, message.receiver][message.t_type];
    if (target === user.value.id) {
        return;
    }
    if (DEBUG) console.log('message read: ', messages.value[target]);
    let m = messages.value[target].find(m => m.message_id === message.content);
    if (m === undefined) {
        // TODO: handle this properly
        return;
    }
    m = m as Message;
    if (m.sender !== user.value.id) {
        if (DEBUG) console.log("error receive read:", target, m, "not send by this user");
        return;
    }
    getAsyncMessage(m.message_id as number).then((message) => {
        if (message === undefined) {
            if (DEBUG) console.log("error receive read:", target, m, "not found");
            return;
        }
        m!.who_read = message.who_read;
    });
}

export const handleUnblockFriend = (message: Message) => {
    getBlackList().then();
}
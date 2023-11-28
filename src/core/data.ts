import {
    cache,
    contacts,
    messages,
    rawChatList,
    rawRequestList,
    requests,
    selectedChatInfo, selectedContactInfo,
    settings,
    userId,
    users
} from "../globals";
import axios from "axios";
import {BASE_API_URL} from "../constants";
import {ContactsData, RequestListItem, UserData} from "../utils/structs";
import {token} from "../auth.ts";


const getUser = async (id: number, force: boolean = false): Promise<ContactsData> => {
    if (!force && users.value[id] !== undefined) {
        return users.value[id];
    }
    const response = await axios.get(BASE_API_URL + "users/" + id, {
        headers: {
            Authorization: token.value,
        }
    });
    users.value[id] = response.data as UserData;
    return users.value[id];
}

export const getAvatarOrDefault = (md5: string | undefined) => {
    if (md5 === undefined) return './Logo.png';
    if (cache.value[md5]) {
        return cache.value[md5] as string;
    }
    return './Logo.png';
}

export const contactInsert = (id: number) => {
    if (contacts.value.includes(id) || id === userId.value) return;
    const index = contacts.value.length;
    contacts.value.push(id);
    rawChatList.value.push({
        id: 0,
        name: 'Loading...',
        avatar: '',
        category: 'group',
        unread_counter: 0,
        members: [],
        owner: 0,
        admin: [],
        pin: false,
        mute: false,
        block: false,
    });
    getUser(id).then((contact) => {
        rawChatList.value[index] = {
            id: id,
            name: contact.name,
            avatar: contact.avatar,
            category: contact.category,
            unread_counter: 0,
            members: contact.members,
            owner: contact.owner,
            admin: contact.admin,
            pin: settings.value.pinned.includes(id),
            mute: settings.value.muted.includes(id),
            block: settings.value.blocked.includes(id),
        };
        console.log(contact);
    });
    if (messages.value[id] === undefined) {
        messages.value[id] = [];
    }
}

export const contactRemove = (id: number) => {
    if (!contacts.value.includes(id)) return;
    if (id === userId.value) return;
    contacts.value = contacts.value.filter((i: number) => i !== id);
    rawChatList.value = rawChatList.value.filter((entry: any) => {
        return entry === undefined || entry.id !== id
    });
    delete messages.value[id];
}

export const contactUpdate = (id: number) => {
    if (!contacts.value.includes(id)) return;
    if (id === userId.value) return;
    getUser(id, true).then((contact) => {
        let index = -1;
        for (const i in rawChatList.value) {
            if (rawChatList.value[i].id === id) {
                index = i;
                break;
            }
        }
        if (index < 1) return;
        rawChatList.value[index] = {
            id: id,
            name: contact.name,
            avatar: contact.avatar,
            category: contact.category,
            unread_counter: 0,
            members: contact.members,
            pin: settings.value.pinned.includes(id),
            mute: settings.value.muted.includes(id),
            block: settings.value.blocked.includes(id),
        };
        console.log('contact force updated: ', contact);
        if (selectedChatInfo.value && selectedChatInfo.value.id === id) {
            selectedChatInfo.value = contact;
        }
        if (selectedContactInfo.value && selectedContactInfo.value.id === id) {
            selectedContactInfo.value = contact;
        }
    });
}

export const requestInsert = (id: number, info: RequestListItem) => {
    if (requests.value.includes(id)) return;
    requests.value.push(id);
    rawRequestList.value.push(info);
}

export const requestRemove = (id: number) => {
    requests.value = requests.value.filter((i: number) => (i !== id));
    rawRequestList.value = rawRequestList.value.filter((i) => (i.id !== id));
}

export {
    getUser,
}
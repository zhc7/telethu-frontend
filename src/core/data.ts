import {
    activeRequestId,
    cache,
    contacts,
    messages,
    rawChatList,
    rawRequestList,
    requests,
    selectedChatInfo,
    selectedContactInfo,
    settings,
    userId,
    users
} from "../globals";
import axios from "axios";
import {BASE_API_URL} from "../constants";
import {ChatListItem, ContactsData, RequestListItem, UserData} from "../utils/structs";
import {token} from "../auth.ts";
import {avatarUrl} from "../utils/urls.ts";


const getUser = async (id: number, force: boolean = false): Promise<ContactsData> => {
    if (id === -1) {
        id = userId.value;
    }
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

export const getAvatar = async (hash: string) => {
    if (cache.value[hash]) return;
    const url = avatarUrl(hash);
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: token.value,
            },
            responseType: "blob",
        });
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
            cache.value[hash] = reader.result;
        };
    } catch(error) {
        console.log("error fetching", error);
        return './Logo.png'
    }
    return cache.value[hash];
}


const parseChatListItem = (contact: ContactsData): ChatListItem => {
    const item = contact as ChatListItem;
    const id = item.id;
    item.pin = settings.value.pinned.includes(id);
    item.mute = settings.value.muted.includes(id);
    item.block = settings.value.blocked.includes(id);
    item.unread_counter = 0;
    return item;
}

export const contactInsert = async (id: number, force: boolean = false) => {
    if (contacts.value.includes(id) || id === userId.value) return;
    if (force) {
        contacts.value.push(id);
        const contact = await getUser(id);
        const item = parseChatListItem(contact);
        rawChatList.value.push(item);
        console.log(contact);
        if (messages.value[id] === undefined) {
            messages.value[id] = [];
        }
        return;
    }
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
        rawChatList.value[index] = parseChatListItem(contact);
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
                index = +i;
                break;
            }
        }
        if (index < 1) return;
        rawChatList.value[index] = parseChatListItem(contact);
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
    activeRequestId.value = 0;
    requests.value = requests.value.filter((i: number) => (i !== id));
    rawRequestList.value = rawRequestList.value.filter((i) => (i.id !== id));
}

export {
    getUser,
}
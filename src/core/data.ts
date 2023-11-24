import {cache, contacts, messages, rawChatList, rawRequestList, requests, settings, users} from "../globals";
import axios, {request} from "axios";
import {BASE_API_URL} from "../constants";
import {ContactsData, UserData} from "../utils/structs";
import {token} from "../auth.ts";
import {el} from "vuetify/locale";


const getUser = async (id: number): Promise<ContactsData> => {
    if (users.value[id] !== undefined) {
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

const getCache = async (hash: string) => {
    return '';
    if (cache.value[hash] !== undefined) {
        return cache.value[hash];
    }
    let url;
    if (hash.startsWith("http")) {
        url = hash;
    } else {
        if (hash.startsWith("./files")) {
            url = BASE_API_URL + hash;
        } else {
            url = BASE_API_URL + 'files/' + hash;
        }
    }
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: token.value,
            },
        });
        cache.value[hash] = response.data as ArrayBuffer;
    } catch(error) {
        console.log("error fetching", error);
    }
    return cache.value[hash];
}

const parse_Avatar = (arrayBuffer: ArrayBuffer) => {
    if (!arrayBuffer) return '/Shenium.png';
    const blob = new Blob([arrayBuffer], {type: 'image/jpeg'});
    return URL.createObjectURL(blob);
}

export const contactInsert = (id: number) => {
    const index = contacts.value.length;
    contacts.value.push(id);
    rawChatList.value.push({
        id: 0,
        name: 'Telethu',
        avatar: '',
        avatar_storage: '',
        category: 'group',
        unread_counter: 0,
        pin: false,
        mute: false,
        block: false,
    });
    getUser(id).then((contact) => {
        getCache(contact.avatar).then((ava) => {
            rawChatList.value[index] = {
                id: id,
                name: contact.name,
                avatar: contact.avatar,
                // avatar_storage: parse_Avatar(ava),
                category: contact.category,
                unread_counter: 0,
                pin: settings.value.pinned.includes(id),
                mute: settings.value.muted.includes(id),
                block: settings.value.blocked.includes(id),
            }
        })
    });
    if (messages.value[id] === undefined) {
        messages.value[id] = [];
    }
}

export const contactRemove = (id: number) => {
    contacts.value = contacts.value.filter((i: number) => i !== id);
    rawChatList.value = rawChatList.value.filter((entry: any) => {
        return entry === undefined || entry.id !== id
    });
    delete messages.value[id];
}

export const requestInsert = (id: number, info: ContactsData | undefined = undefined) => {
    const index = requests.value.length;
    requests.value.push(id);
    rawRequestList.value.push({
        id: 0,
        name: 'Telethu',
        email: 'tele@thu.com',
        avatar: './Shenium.png',
    });
    if (info !== undefined) {
        rawRequestList.value[index] = {
            id: info.id,
            name: info.name,
            email: info.email,
            avatar: info.avatar,
        };
    } else {
        getUser(id).then((contact) => {
            rawRequestList.value[index] = {
                id: contact.id,
                name: contact.name,
                email: contact.email ? contact.email : 'tele@thu.com',
                avatar: contact.avatar ? contact.avatar : './Shenium.png',
            };
        })
    }
}

export {
    getUser,
    getCache,
}
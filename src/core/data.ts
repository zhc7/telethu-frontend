import {activeRequestId, blacklist, rawRequestList, requests, settings, users} from "../globals";
import axios from "axios";
import {BASE_API_URL} from "../constants";
import {ContactsData, RequestListItem} from "../utils/structs";
import {token} from "../auth.ts";


const getUser = (id: number, force: boolean = false): ContactsData => {
    if (users.value[id] === undefined) {
        users.value[id] = {
            id,
            name: "Loading...",
            avatar: "",
            category: "",
        };
    }
    force ||= users.value[id].category === "";
    force &&= id > 0;
    if (force) {
        axios.get(BASE_API_URL + "users/" + id, {
            headers: {
                Authorization: token.value,
            }
        }).then((response) => {
            const data = response.data;
            // do not break reactivity
            for (const key in data) {
                (users.value[id][key as keyof ContactsData] as any) = data[key];
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    return users.value[id];
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

export const postSettings = async () => {
    return await axios.post(BASE_API_URL + 'users/profile', {
        settings: settings.value,
    },{
        headers: {
            Authorization: token.value,
        }
    });
}

export const getSettings = async () => {
    return await axios.get(BASE_API_URL + 'users/profile', {
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        const received = response.data.settings;
        if (received !== undefined && "pinned" in received) {
            settings.value = received;
        } else {
            postSettings();
        }
    });
};

export const getBlackList = async () => {
    return await axios.get(BASE_API_URL + 'users/block_user_list', {
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        console.log('got black list', response.data);
        console.log('settings.blocked: ', settings.value.blocked)
        blacklist.value = response.data.block_list;
    });
}


export {
    getUser,
}
import {activeRequestId, blacklist, candidatesList, requests, settings, user, users} from "../globals";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "../constants";
import {ContactsData} from "../utils/structs";
import {token} from "../auth.ts";
import {isAdmin} from "../utils/grouprole.ts";


const getUser = (id: number, force: boolean = false): ContactsData => {
    if (!users.value[id]) {
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
            if (DEBUG) console.log(err);
        })
    }
    return users.value[id];
}

export const getCandidateList = async (groupId: number) => {
    if (!isAdmin(user.value.id, groupId)) return;
    const result = (await axios.get(BASE_API_URL + `users/group_candidates/${groupId}`, {
        headers: {
            Authorization: token.value
        }
    })).data.candidates;
    candidatesList.value[groupId] = result;
    return result;
}

export const requestRemove = (id: number) => {
    activeRequestId.value = 0;
    requests.value = requests.value.filter((i: number) => (i !== id));
}

export const postSettings = async () => {
    return await axios.post(BASE_API_URL + 'users/profile', {
        settings: settings.value,
    }, {
        headers: {
            Authorization: token.value,
        }
    });
}

export const getSettings = async () => {
    await axios.get(BASE_API_URL + 'users/profile', {
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        const received = response.data.settings;
        if (received !== undefined && "pinned" in received) {
            settings.value = received;
            if (!settings.value.tags) {
                settings.value.tags = {};
                postSettings().then();
            }
        } else {
            postSettings().then();
        }
        if (DEBUG) console.log('got settings: ', response.data);
    });
};

export const getBlackList = async () => {
    return await axios.get(BASE_API_URL + 'users/block_user_list', {
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        if (DEBUG) console.log('got black list', response.data);
        blacklist.value = response.data["block_list"];
    });
}


export {
    getUser,
}
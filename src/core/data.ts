import {cache, users} from "../globals";
import axios from "axios";
import {BASE_API_URL} from "../constants";
import {ContactsData, UserData} from "../utils/structs";
import {token} from "../auth.ts";


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

export {
    getUser,
    getCache,
}
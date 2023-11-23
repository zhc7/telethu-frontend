import {cache, users} from "../globals";
import axios from "axios";
import {BASE_API_URL} from "../constants";
import {ContactsData, UserData} from "../utils/structs";
import {token} from "../auth.ts";


const getUser = async (id: number): Promise<ContactsData> => {
    console.log("querying", id, "from", users.value);
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
    let response;
    if (hash.startsWith("http")) {
        response = await axios.get(hash);
    }
     else {
         response = await axios.get(BASE_API_URL + "files/" + hash);
    }
    cache.value[hash] = response.data as ArrayBuffer;
    return cache.value[hash];
}

export {
    getUser,
    getCache,
}
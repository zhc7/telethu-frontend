import {cache, contacts} from "../globals";
import axios from "axios";
import {BASE_API_URL} from "../constants";
import {UserData} from "../utils/structs";


const getUser = async (id: number) => {
    if (contacts.value[id] !== undefined) {
        return contacts.value[id];
    }
    const response = await axios.get(BASE_API_URL + "users/" + id);
    contacts.value[id] = response.data as UserData;
    return contacts.value[id];
}

const getCache = async (hash: string) => {
    if (cache.value[hash] !== undefined) {
        return cache.value[hash];
    }
    const response = await axios.get(BASE_API_URL + "files/" + hash);
    cache.value[hash] = response.data as ArrayBuffer;
    return cache.value[hash];
}
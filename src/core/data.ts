import {activeRequestId, rawRequestList, requests, users} from "../globals";
import axios from "axios";
import {BASE_API_URL} from "../constants";
import {ContactsData, RequestListItem} from "../utils/structs";
import {token} from "../auth.ts";


const getUser = (id: number, force: boolean = false): ContactsData => {
    if (users.value[id] === undefined || users.value[id].category === "") {
        users.value[id] = {
            id,
            name: "Loading...",
            avatar: "",
            category: "",
        }
        force = true;
    }
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
            console.log("updated " + id)
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

export {
    getUser,
}
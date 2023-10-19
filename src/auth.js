import {ref} from "vue";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "./constants.js"
import {useLocalStorage} from "@vueuse/core"

const userId = useLocalStorage("userId", "");
const userName = useLocalStorage("userName", "");
const token = useLocalStorage("token", "");

const login = (account, password) => {
    if (DEBUG) {
        console.log("login " + account);
    }
    return axios.post(BASE_API_URL + "users/login", {userName: account, password}).then((res) => {
        userName.value = account;
        token.value = res.data.token;
        userId.value = res.data.user_id;
        return "";
    }).catch((err) => {
        console.log("error caught");
        if (err.response && err.response.data) {
            return err.response.data.info;
        } else {
            return "network error";
        }
    });
}

const register = (account, password) => {
    if (DEBUG) {
        console.log("register " + account);
    }
    axios.post(BASE_API_URL + "users/register", {userName: account, password}).then((res) => {
        userName.value = res.data;
    })
}

export {userId, userName, token, login, register}

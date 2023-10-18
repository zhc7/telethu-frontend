import {ref} from "vue";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "constants"
import {useLocalStorage} from "@vueuse/core"

const userId = useLocalStorage("userId", "");
const userName = useLocalStorage("userName", "");
const token = useLocalStorage("token", "");

const login = (userName, password) => {
    if (DEBUG) {
        console.log("login " + userName);
    }
    return axios.post(BASE_API_URL + "users/login", {userName, password}).then((res) => {
        userName.value = userName;
        token.value = res.data.token;
        userId.value = res.data.userId;
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

const register = (userName, password) => {
    if (DEBUG) {
        console.log("register " + userName);
    }
    axios.post(BASE_API_URL + "users/register", {userName, password}).then((res) => {
        userName.value = res.data;
    })
}

export {userId, userName, token, login, register}

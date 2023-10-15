import {ref} from "vue";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "./const/constants"
import {useLocalStorage} from "@vueuse/core"

const user = useLocalStorage("user", "");
const token = useLocalStorage("token", "");

const login = (userName, password) => {
    if (DEBUG) {
        console.log("login " + userName);
    }
    return axios.post(BASE_API_URL + "users/login", {userName, password}).then((res) => {
        user.value = userName;
        token.value = res.data.token;
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
        user.value = res.data;
    })
}

export {user, login, register}

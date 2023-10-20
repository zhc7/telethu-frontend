import {ref} from "vue";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "./constants.js"
import {useLocalStorage} from "@vueuse/core"

const userId = useLocalStorage("userId", -1);
const userName = useLocalStorage("userName", "");
export const userEmail = useLocalStorage("userEmail", "");
const token = useLocalStorage("token", "");

const login = (email, password) => {
    if (DEBUG) {
        console.log("login " + email);
    }
    return axios.post(BASE_API_URL + "users/login", {userEmail: email, password}).then((res) => {
        userEmail.value = email;
        console.log(res.data);
        token.value = res.data.token;
        userId.value = parseInt(res.data["user_id"]);
        userName.value = res.data["UserName"];
        console.log(token.value, userId.value, userName.value);
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

const logout = () => {
    token.value = "";
    userName.value = "";
    userEmail.value = "";
    userId.value = -1;
}

const register = (name, email, password) => {
    if (DEBUG) {
        console.log("register " + email);
    }
    axios.post(BASE_API_URL + "users/register", {userName: name, userEmail: email, password}).then((res) => {
        console.log("register succeeded");
    })
}

export {userId, userName, token, login, register, logout}

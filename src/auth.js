import {ref} from "vue";
import axios from "axios";
import { DEBUG, BASE_API_URL } from "./const/constants"

const user = ref("")

const login = (userName, password) => {
    user.value = userName;
    if (DEBUG) {
        console.log("login " + userName);
    }
    axios.post(BASE_API_URL + "users/login", {userName, password}).then((res) => {
        user.value = res.data;
    })
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

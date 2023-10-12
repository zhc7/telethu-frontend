import {ref} from "vue";
import axios from "axios";

const user = ref("")
const url = "http://localhost:8000/"

const login = (userName, password) => {
    user.value = userName
    console.log("login " + userName)
    axios.post(url + "users/login", {userName, password}).then((res) => {
        user.value = res.data
    })
}

const register = (userName, password) => {
    console.log("register " + userName)
    axios.post(url + "users/register", {userName, password}).then((res) => {
        user.value = res.data
    })
}

export {user, login, register}

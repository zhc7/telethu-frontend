import {computed, ref} from "vue";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "./constants.js"
import {useLocalStorage} from "@vueuse/core"
import {contacts} from "./chat.js";

export const user = useLocalStorage("user", {})

export const userId = computed({
    get() {
        return user.value.id;
    },
    set(newValue) {
        user.value.id = newValue;
    },
})
export const userName = computed({
    get() {
        return user.value.name;
    },
    set(newValue) {
        user.value.name = newValue;
    }
})
export const userEmail = computed({
    get() {
        return user.value.email;
    },
    set(newValue) {
        user.value.email = newValue;
    }
})
const token = useLocalStorage("token", "");

axios.interceptors.response.use(res => res, err => {
    // if (err.response && err.response.status === 401) {
    //     logout();
    // }
    return Promise.reject(err);
});

const login = (email, password) => {
    if (DEBUG) {
        console.log("login " + email);
    }
    return axios.post(BASE_API_URL + "users/login", {userEmail: email, password}).then((res) => {
        console.log(res.data);
        token.value = res.data.token;
        user.value = res.data.user;
        console.log(token.value, user.value);
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
    contacts.value = {};
    user.value = {};
}

const register = async (name, email, password) => {
    if (DEBUG) {
        console.log("register " + email);
    }
    await axios.post(BASE_API_URL + "users/register", {userName: name, userEmail: email, password}).then((res) => {
        console.log("register succeeded");
    })
}

export {token, login, register, logout}

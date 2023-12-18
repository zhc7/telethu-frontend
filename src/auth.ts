import axios from "axios";
import {BASE_API_URL, DEBUG} from "./constants"
import {useLocalStorage} from "@vueuse/core"
import {blacklist, contacts, messages, requests, user, users} from "./globals";
import router from "./router.ts";

const token = useLocalStorage("token", "");

axios.interceptors.response.use(res => res, err => {
    if (err.response && err.response.status === 401) {
        logout();
        router.push("/login");
    }
    return Promise.reject(err);
});

const login = async (email: string, password: string) => {
    if (DEBUG) console.log("login " + email);
    return axios.post(BASE_API_URL + "users/login", {userEmail: email, password}).then((res) => {
        if (DEBUG) console.log(res.data);
        token.value = res.data.token;
        user.value = res.data.user;
        if (DEBUG) console.log(token.value, user.value);
        return "";
    }).catch((err) => {
        if (DEBUG) console.log("error caught");
        if (err.response && err.response.data) {
            return err.response.data.info;
        } else {
            return "network error";
        }
    });
}

const logout = () => {
    messages.value = {};
    contacts.value = [];
    requests.value = [];
    blacklist.value = [];
    token.value = "";
    users.value = {};
    user.value = {email: "", id: -1, name: "", avatar: "", category: "user"};
}

const register = async (name: string, email: string, password: string, verifyCode: string) => {
    if (DEBUG) console.log("register " + email);
    await axios.post(BASE_API_URL + "users/register", {userName: name, userEmail: email, password, verification_code: verifyCode}).then((res) => {
        // TODO: actually handle the response and errors, please only remove this after the issue is actually resolved
        if (DEBUG) console.log('response: ', res);
        if (DEBUG) console.log("register succeeded");
    })
}

const getVerifyCode = async (email: string) => {
    if (DEBUG) console.log("get verify code " + email);
    await axios.post(BASE_API_URL + "users/receive_code", {userEmail: email}).then((res) => {
        if (DEBUG) console.log("get verify code succeeded", res.data);
    })
}

export {token, login, register, logout, getVerifyCode}

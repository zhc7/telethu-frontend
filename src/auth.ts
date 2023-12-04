import axios from "axios";
import {BASE_API_URL, DEBUG} from "./constants"
import {useLocalStorage} from "@vueuse/core"
import {settings, user} from "./globals";
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
    user.value = {email: "", id: -1, name: "", avatar: "", category: "user"};
}

const register = async (name: string, email: string, password: string) => {
    if (DEBUG) {
        console.log("register " + email);
    }
    await axios.post(BASE_API_URL + "users/register", {userName: name, userEmail: email, password}).then((res) => {
        // TODO: get actual response
        console.log('response: ', res);
        console.log("register succeeded");
    })
}

export {token, login, register, logout}

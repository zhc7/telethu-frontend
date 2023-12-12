import {Message, UserData} from "../../utils/structs.ts";
import {user} from "../../globals.ts";
import axios from "axios";
import {BASE_API_URL} from "../../constants.ts";
import {token} from "../../auth.ts";
import {getSettings, postSettings} from "../data.ts";

export const editProfile = async (newProfile: any, http: boolean = true) => {
    if (newProfile.email) {
        const res = await axios.get(BASE_API_URL + 'users/email_exists/' + newProfile.email);
        if (res.data === 'True') {
            return;
        }
        console.log('email exists: ', res);
    }
    if (http) {
        const response = await axios.post(BASE_API_URL + 'users/edit_profile', newProfile, {
            headers: {
                Authorization: token.value,
            }
        });
        console.log('edited profile: ', response);
        user.value = {
            ...user.value,
            ...response.data,
        };
        console.log('new info:', user.value);
    } else {
        postSettings().then(() => {
            getSettings();
        });
    }
}

export const updateUserProfile = (message: Message) => {
    const newProfile = JSON.parse(message.content as string);
    user.value = {
        ...user.value,
        ...newProfile,
    } as UserData;
}
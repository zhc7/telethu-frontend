import {Message, UserData} from "../../utils/structs.ts";
import {user} from "../../globals.ts";
import axios from "axios";
import {BASE_API_URL} from "../../constants.ts";
import {token} from "../../auth.ts";
import {getUser} from "../data.ts";

export const editProfile = async (newProfile: any) => {
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
}

export const updateUserProfile = (message: Message) => {
    const newProfile = JSON.parse(message.content as string);
    user.value = {
        ...user.value,
        ...newProfile,
    } as UserData;
}
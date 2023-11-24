import {BASE_API_URL} from "../constants.ts";

export const avatarUrl = (md5: string) => {
    return BASE_API_URL + 'users/avatar/' + md5;
}
import axios from "axios";
import {BASE_API_URL} from "../constants.js";
import {token} from "../auth.js";

const uploadfiles = (file, md5, friendId) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("friendId", friendId);

    axios.post(BASE_API_URL + "/files/" + md5, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token.value,
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
}

export {
    uploadfiles
}
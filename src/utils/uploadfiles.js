import axios from "axios";
import {BASE_API_URL} from "../constants.js";
import {token} from "../auth.js";

function getFileExtension(filename) {
    let parts = filename.split('.');
    if (parts.length > 1) {
        return parts.pop();
    } else {
        return '';
    }
}

const getFileType = (filename) => {
    const extension = getFileExtension(filename);
    switch (extension.toLowerCase()) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return 1;
        case 'mp3':
        case 'wav':
        case 'flac':
            return 2;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
            return 3;
        default:
            return 4;
    }
}

const upLoadFiles = (file, md5) => {
    console.log("sending this file -> ", file);
    console.log("send to this url -> ", BASE_API_URL + "files/" + md5);
    const fileType = file.type;
    axios.post(BASE_API_URL + "files/" + md5 + "/", file, {
        headers: {
            "Content-Type": fileType,
            Authorization: token.value,
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log("Error when http uploading file -> ", err);
    });
};


export {
    upLoadFiles,
    getFileExtension,
    getFileType
}
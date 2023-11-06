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
            return 'image';
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
            return 'video';
        case 'mp3':
        case 'wav':
        case 'flac':
            return 'audio';
        case 'pdf':
            return 'pdf';
        case 'doc':
        case 'docx':
            return 'word';

        default:
            return 'file';
    }
}

const upLoadFiles = (file, md5, friendId) => {
    console.log("sending this file -> ",file);
    const fileType = file.type;
    axios.post(BASE_API_URL + "/files/" + md5, file, {
        headers: {
            "Content-Type": fileType,
            Authorization: token.value,
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
};


export {
    upLoadFiles,
    getFileExtension,
    getFileType
}
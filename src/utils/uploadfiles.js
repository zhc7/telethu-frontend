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

const uploadfiles = (file, md5, friendId) => {
    const formData = new FormData();
    formData.append("file", file);

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
    uploadfiles,
    getFileExtension,
    getFileType
}
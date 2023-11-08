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

const formatFileSize = (bytes) => {
    if (bytes < 1024) {
        return bytes + ' Bytes';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    } else {
        return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
    }
};

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

const upLoadFiles = (file, md5, updateLoading) => {
    const fileType = file.type;
    return axios.post(BASE_API_URL + "files/" + md5 + "/", file, {
        headers: {
            "Content-Type": fileType,
            Authorization: token.value,
        },
        onUploadProgress: progressEvent => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            updateLoading(percentCompleted);
            console.log("Percent completed -> ", percentCompleted);
        }
    }).then(res => {
        console.log("HTTP upload successful -> ", res);
        return res;
    }).catch(err => {
        console.error("Error when http uploading file -> ", err);
        throw err;
    });
};



export {
    upLoadFiles,
    getFileExtension,
    getFileType,
    formatFileSize,
}
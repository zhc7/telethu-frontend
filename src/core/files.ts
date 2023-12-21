import axios from "axios";
import {BASE_API_URL, DEBUG} from "../constants";
import {token} from "../auth";
import {MessageType, TargetType} from "../utils/structs.ts";

function getFileExtension(filename: string): string {
    let parts = filename.split('.');
    return parts.pop() || '';
}

const formatFileSize = (bytes: number) => {
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

const getFileType = (filename: string) => {
    const extension = getFileExtension(filename);
    switch (extension.toLowerCase()) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return MessageType.IMAGE;
        case 'mp3':
        case 'wav':
        case 'flac':
        case 'webm':
            return MessageType.AUDIO;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
            return MessageType.VIDEO;
        default:
            return MessageType.FILE;
    }
}

const uploadFiles = (file: File, md5: string, updateLoading: Function) => {
    console.log(file.name.slice(0,2)+': "'+md5+'",')
    // TODO: complete typing
    const fileType = file.type;
    return axios.post(BASE_API_URL + "files/" + md5 + "/", file, {
        headers: {
            "Content-Type": fileType,
            Authorization: token.value,
        },
        onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) {
                updateLoading(1);
                return;
            }
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            updateLoading(percentCompleted);
            if (DEBUG) console.log("Percent completed -> ", percentCompleted);
        }
    }).then(res => {
        if (DEBUG) console.log("HTTP upload successful -> ", res);
        return res;
    }).catch(err => {
        console.error("Error when http uploading file -> ", err);
        throw err;
    });
};


const downloadFile = async (src: string) => {
    let response = await axios.get(BASE_API_URL + 'files/' + src + '/', {
        responseType: 'blob',
        headers: {
            Authorization: token.value,
        }
    })
    const urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(response.data);
}

const triggerDownload = async (src: string, filename: string) => {
    const blobUrl = await downloadFile(src);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a); // 将元素添加到页面中
    a.click(); // 模拟点击
    document.body.removeChild(a); // 移除元素

    window.URL.revokeObjectURL(blobUrl);
};


export {
    uploadFiles,
    downloadFile,
    getFileExtension,
    getFileType,
    formatFileSize,
    triggerDownload
}
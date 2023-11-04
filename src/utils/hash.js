import CryptoJS from "crypto-js";
import SparkMD5 from "spark-md5";

const generateMessageId = (content, sender, time) => {
    const data = `${content}${sender}${time}`;
    const hash = CryptoJS.SHA256(data);
    return hash.toString(CryptoJS.enc.Hex);
}

const calculateMD5 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const data = event.target.result;
            const md5 = SparkMD5.ArrayBuffer.hash(data);
            resolve(md5);
        };

        reader.onerror = function(err) {
            reject(err);
        };

        reader.readAsArrayBuffer(file);
    });
};

const generateMD5 = (file) => {
    calculateMD5(file).then(md5 => {
        return md5;
    }).catch(err => {
        console.log(err);
        return err;
    });
}


export {
    generateMessageId,
    calculateMD5,
    generateMD5,
}
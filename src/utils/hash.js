import CryptoJS from "crypto-js";
import SparkMD5 from "spark-md5";

const generateMessageId = (content, sender, time) => {
    const data = `${content}${sender}${time}`;
    const hash = CryptoJS.SHA256(data);
    return hash.toString(CryptoJS.enc.Hex);
}

const calculateMD5 = async (file) => {
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

const generateMD5 = async (file) => {
    try {
        const md5 = await calculateMD5(file);
        return md5;
    } catch (err) {
        console.error(err);
        return err;
    }
};


export {
    generateMessageId,
    calculateMD5,
    generateMD5,
}
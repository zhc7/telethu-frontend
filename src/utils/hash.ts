import CryptoJS from "crypto-js";
import SparkMD5 from "spark-md5";

const generateMessageId = (content: any, sender: number, time: number) => {
    const data = `${content}${sender}${time}`;
    const hash = CryptoJS.SHA256(data);
    return hash.toString(CryptoJS.enc.Hex);
}

const calculateMD5 = async (file: any) => {
    // TODO: what's the type of `file`?
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const data = event.target.result as ArrayBuffer;
            const md5 = SparkMD5.ArrayBuffer.hash(data);
            resolve(md5);
        };

        reader.onerror = function(err) {
            reject(err);
        };

        reader.readAsArrayBuffer(file);
    });
};

const generateMD5 = async (file: any): Promise<string> => {
    // TODO: what's the type of `file`?
    try {
        return await calculateMD5(file);
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
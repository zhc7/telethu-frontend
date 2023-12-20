import CryptoJS from "crypto-js";
import SparkMD5 from "spark-md5";

const generateMessageId = (content: any, sender: number, time: number) => {
    const data = `${content}${sender}${time}`;
    const hash: CryptoJS.lib.WordArray = CryptoJS.SHA256(data);
    return hash.toString(CryptoJS.enc.Hex);
}

const calculateMD5 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const data = event.target?.result as ArrayBuffer;
            const md5: string = SparkMD5.ArrayBuffer.hash(data);
            resolve(md5);
        };

        reader.onerror = function(err) {
            reject(err);
        };

        reader.readAsArrayBuffer(file);
    });
};

const generateMD5 = async (file: File): Promise<string> => {
    try {
        return await calculateMD5(file);
    } catch (err) {
        console.error(err);
        return err instanceof Error ? err.message : String(err);
    }
};

export const stringMd5 = (str) => {
    const hash: CryptoJS.lib.WordArray = CryptoJS.MD5(str);
    return hash.toString(CryptoJS.enc.Hex);
}


export {
    generateMessageId,
    calculateMD5,
    generateMD5,
}
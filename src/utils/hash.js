import CryptoJS from "crypto-js";

const generateMessageId = (content, sender, time) => {
    const data = `${content}${sender}${time}`;
    const hash = CryptoJS.SHA256(data);
    return hash.toString(CryptoJS.enc.Hex);
}

export default generateMessageId;
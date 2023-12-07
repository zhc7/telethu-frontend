import {Message} from "../../utils/structs";
import {getUser} from "../data.ts";
import axios from "axios";
import {reactive} from "vue";

const getMessage = (messageId: number): Message => {
    const message = reactive({
        message_id: messageId,
        m_type: 0,
        t_type: 0,
        content: "",
        info: "",
        receiver: 0,
        sender: 0,
        time: 0,
    });
    axios.get(`/api/messages/${messageId}`).then(res => {
        Object.assign(message, res.data);
    });
    return message;
}

export const handleForwardedMessage = (message: Message) => {
    // TODO
}
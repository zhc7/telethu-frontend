import {Message} from "../../utils/structs";
import {getUser} from "../data.ts";
import axios from "axios";
import {reactive} from "vue";
import {messages, user} from "../../globals.ts";

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

export const handleRecallMessage = (message: Message) => {
    const target = message.sender === user.value.id ? message.receiver : [message.sender, message.receiver][message.t_type];
    let targetMessage = messages.value[target].find((m: Message) => m.message_id === message.content);
    if (targetMessage === undefined) {
        return;
    }
    targetMessage.content = "*message recalled*";
}
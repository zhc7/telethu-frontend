import {Message} from "../../utils/structs";
import axios from "axios";
import {messages, user} from "../../globals.ts";
import {token} from "../../auth.ts";
import {BASE_API_URL} from "../../constants.ts";

export const getAsyncMessage = async (messageId: number): Promise<Message> => {
    return axios.get(BASE_API_URL + `chat/message/${messageId}`, {
        headers: {
            Authorization: token.value,
        }
    }).then(res => res.data);
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

export const handleDeleteMessage = (message: Message) => {
    const target = message.sender === user.value.id ? message.receiver : [message.sender, message.receiver][message.t_type];
    messages.value[target] = messages.value[target].filter((m: Message) => m.message_id !== message.content);
}
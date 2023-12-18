import {Message} from "../../utils/structs";
import axios from "axios";
import {messageDict, messages, user} from "../../globals.ts";
import {token} from "../../auth.ts";
import {BASE_API_URL} from "../../constants.ts";
import {callSnackbar} from "../../utils/snackbar.ts";

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
        callSnackbar(message.content as string, "error");
        return;
    }
    targetMessage.content = "*message recalled*";
    targetMessage.status = 3;
    callSnackbar("message recalled", "info");
}

export const handleDeleteMessage = (message: Message) => {
    const target = message.sender === user.value.id ? message.receiver : [message.sender, message.receiver][message.t_type];
    messages.value[target] = messages.value[target].filter((m: Message) => m.message_id !== message.content);
}

export const updateMessage = (message: Message) => {
    const target = message.sender === user.value.id ? message.receiver : [message.sender, message.receiver][message.t_type];
    const messageId = message.content as number;
    getAsyncMessage(messageId).then((msg) => {
        Object.bind(messages.value[target][messageId], msg);
        Object.bind(messageDict.value[messageId], msg);
    });
}
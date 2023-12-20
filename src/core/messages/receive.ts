import {Message} from "../../utils/structs";
import axios from "axios";
import {messageDict, messages, user} from "../../globals.ts";
import {token} from "../../auth.ts";
import {BASE_API_URL} from "../../constants.ts";
import {callSnackbar} from "../../utils/snackbar.ts";
import {messageBlocks} from "../blocks.ts";

export const getAsyncMessage = async (messageId: number): Promise<Message> => {
    return axios.get(BASE_API_URL + `chat/message/${messageId}`, {
        headers: {
            Authorization: token.value,
        }
    }).then(res => res.data);
}

export const handleRecallMessage = (message: Message) => {
    const target = message.sender === user.value.id ? message.receiver : [message.sender, message.receiver][message.t_type];
    const mid = message.content as number;
    const targetMessage = messages.value[target].find((m: Message) => m.message_id === mid);
    if (targetMessage !== undefined) {
        targetMessage.content = "*message recalled*";
        targetMessage.status = 3;
    }
    const anotherTarget = messageDict.value[mid];
    if (anotherTarget === undefined) return;
    anotherTarget.content = "*message recalled*";
    anotherTarget.status = 3;
    callSnackbar("message recalled", "info");
}

export const handleDeleteMessage = (message: Message) => {
    const target = message.sender === user.value.id ? message.receiver : [message.sender, message.receiver][message.t_type];
    const mid = message.content as number;
    messages.value[target] = messages.value[target].filter((m: Message) => m.message_id !== mid);
    for (const block of messageBlocks.value[target]) {
        // remove mid from block.messages
        const index = block.messages.findIndex(id => id === mid);
        if (index !== -1) {
            block.messages.splice(index, 1);
            break;
        }
    }
}

const bind = (obj: any, target: any) => {
    if (!obj || !target) return;
    for (const key in target) {
        obj[key] = target[key];
    }
}

export const updateMessage = (message: Message) => {
    const target = message.sender === user.value.id ? message.receiver : [message.sender, message.receiver][message.t_type];
    const messageId = message.content as number;
    getAsyncMessage(messageId).then((msg) => {
        bind(messages.value[target].find(m => m.message_id === messageId), msg);
        bind(messageDict.value[messageId], msg);
    });
}
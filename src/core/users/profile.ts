import {Message, UserData} from "../../utils/structs.ts";
import {user, userName} from "../../globals.ts";
import {generateMessageId} from "../../utils/hash.ts";
import {chatManager} from "../chat.ts";

export const editProfile = (newProfile: string) => {
    const message: Message = {
        time: Date.now(),
        m_type: 29,
        t_type: 1,
        content: newProfile,
        sender: user.value.id,
        receiver: user.value.id,
        info: "",
        message_id: generateMessageId(user.value.id, user.value.id, Date.now()),
    }
    console.log(JSON.stringify(message));
    chatManager.sendMessage(message);
}

export const updateUserProfile = (message: Message) => {
    const newProfile = JSON.parse(message.content as string);
    user.value = {
        ...user.value,
        ...newProfile,
    } as UserData;
}
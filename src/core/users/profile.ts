import {Message, UserData} from "../../utils/structs.ts";
import {user, userId} from "../../globals.ts";
import {generateMessageId} from "../../utils/hash.ts";
import {chatManager} from "../chat.ts";

export const editProfile = (newProfile: string) => {
    const message: Message = {
        time: Date.now(),
        m_type: 29,
        t_type: 0,
        content: newProfile,
        sender: userId.value,
        receiver: userId.value,
        info: "",
        message_id: generateMessageId(newProfile, userId.value, Date.now()),
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
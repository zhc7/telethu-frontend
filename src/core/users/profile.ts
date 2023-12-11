import {Message, UserData} from "../../utils/structs.ts";
import {user} from "../../globals.ts";
import {generateMessageId} from "../../utils/hash.ts";
import {chatManager} from "../chat.ts";

export const editProfile = (newProfile: UserData) => {
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
    const newProfile = message.content as UserData;
    for (const key in newProfile) {
        (user.value[key as keyof UserData] as any) = newProfile[key as keyof UserData];
    }
}
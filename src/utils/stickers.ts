import {chatManager} from "../core/chat.ts";
import {user} from "../globals.ts";
import {Message, MessageType, TargetType} from "./structs.ts";
import {generateMessageId} from "./hash.ts";

const stickersHash = {
    1: "b7f4b7d679e36f3cbc1141eb7a4077a6",
    2: "caa8d2ae7c8c285ad270c3f9ab9929a8",
    3: "fe9a53a83de490810854bffe333cea6d",
    4: "594de055d16d0204417b3b863b3240e4",
    5: "7c704fddc470d9fe526a12c968a5d3ac",
    6: "60a03ff28f5ec11aa882fa7ad2ffa7ce",
    7: "b90afc772f3c3ebc6f5a7c427ee4f4df",
    8: "675c6ea7015d714a2d6a3671bb56a4d6",
    9: "48aedf629c9ce7b42f7f85567613cb47",
    10: "a913a26dd2942c5f32854e425f75dcae",
    11: "1c45883bd92a59c6578e07aca612c43f",
    12: "01a8a1ca64dd8886449cc935f6ee6593",
    13: "62332e285e8935ac14f6ef8464392f9d",
    14: "1df87df369dc9867b34cd09732d85ccc",
    15: "d2f724bb90cafd8d001902a1bfac7c86",
    16: "012e4faff7e4c9fa5f6b2a3adf994018",
}

export const sendSticker = (id: number, chatId: number, t_type: TargetType) => {
    if (!(id in stickersHash)) {
        return;
    }
    const newMessage: Message = {
        message_id: generateMessageId(id, user.value.id, Date.now()),
        m_type: MessageType.STICKER,
        t_type: t_type,
        content: stickersHash[id],
        receiver: chatId,
        sender: user.value.id,
        time: Date.now(),
    };
    chatManager.sendMessage(newMessage);
}


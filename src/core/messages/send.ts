import {Message, MessageType, TargetType} from "../../utils/structs";
import {chatManager} from "../chat";
import {generateMessageId} from "../../utils/hash";
import {user} from "../../globals";

export const forwardMessage = (messageId: number | Array<number>, receiver: number) => {
    const newMessage: Message = {
        message_id: generateMessageId(messageId, receiver, Date.now()),
        m_type: MessageType.TEXT,
        t_type: TargetType.FRIEND,
        content: "forward",
        info: messageId,
        receiver,
        sender: user.value.id,
        time: Date.now(),
    };
    chatManager.sendMessage(newMessage);
}
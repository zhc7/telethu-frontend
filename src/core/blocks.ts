import {getAsyncMessage} from "./messages/receive.ts";
import {computed, nextTick, ref} from "vue";
import {activeChatId, activeMessages, messageDict, messages, user} from "../globals.ts";
import {Block, Message, TargetType} from "../utils/structs.ts";
import axios from "axios";
import {BASE_API_URL} from "../constants.ts";
import {getUser} from "./data.ts";
import {token} from "../auth.ts";

export const messageBlocks = ref<{
    [id: number]: Array<Block>
}>({});

export const initMessageBlock = (id: number) => {
    const bigNumber = 1000000000000000;
    if (messageBlocks.value[id] === undefined) {
        messageBlocks.value[id] = [{uid: 0, messages: [], startTime: bigNumber, endTime: bigNumber}];
    }
}

export const activeBlockId = ref<number>(0);
export const uid = ref(1);
export const blocks = computed({
    get: () => {
        initMessageBlock(activeChatId.value);
        return messageBlocks.value[activeChatId.value];
    },
    set: (newValue) => {
        messageBlocks.value[activeChatId.value] = newValue;
    }
});

export const addBlock = (id: number, block: Block) => {
    const blocks = messageBlocks.value[id];
    for (let i = 0; i <= blocks.length; i++) {
        if (i === blocks.length || blocks[i].startTime > block.startTime) {
            blocks.splice(i, 0, block);
            activeBlockId.value = i;
            mergeBlocks(id);
            return;
        }
    }
}

export const mergeBlocks = (id: number) => {
    const blocks = messageBlocks.value[id];
    for (let i = 0; i < blocks.length - 1; i++) {
        if (blocks[i].endTime >= blocks[i + 1].startTime) {
            if (id === i + 1) {
                blocks[i + 1].startTime = blocks[i].startTime;
                // uniquely concat
                blocks[i + 1].messages = [...new Set([...blocks[i].messages, ...blocks[i + 1].messages])];
                blocks.splice(i, 1);
            } else {
                blocks[i].endTime = blocks[i + 1].endTime;
                // uniquely concat
                blocks[i].messages = [...new Set([...blocks[i].messages, ...blocks[i + 1].messages])];
                blocks.splice(i + 1, 1);
            }
            if (i < activeBlockId.value) {
                activeBlockId.value--;
            }
            i--;
        }
    }
}

export const jumpTo = (messageId: number) => {
    const scrollTo = () => {
        const el = activeMessages.value[messageId];
        el.$el.scrollIntoView({behavior: "smooth", block: "center"});
        el.$el.classList.add("bg-blue");
        setTimeout(() => {
            el.$el.classList.remove("bg-blue");
        }, 700);
    }
    if (activeBlock.value.messages.includes(messageId)) {
        nextTick().then(() => setTimeout(scrollTo, 50));
        return;
    }
    getAsyncMessage(messageId).then(message => {
        messageDict.value[messageId] = message;
        activeChatId.value = message.sender === user.value.id ? message.receiver : [message.sender, message.receiver][message.t_type];
        addBlock(activeChatId.value, {
            uid: uid.value++,
            messages: [messageId],
            startTime: message.time,
            endTime: message.time,
        });
    }).then(() => {
        setTimeout(() => {
            callback = () => {
                setTimeout(scrollTo, 50);
                callback = () => {
                };
            }
            if (loadingCount === 0) callback();
        }, 50);
    });
}

export const activeBlock = computed(() => {
    return blocks.value[activeBlockId.value];
});

let loadingCount = 0;

let callback = () => {
};

export const startLoading = () => {
    loadingCount++;
}

export const endLoading = () => {
    loadingCount--;
    if (loadingCount === 0) {
        callback();
    }
}

export const updateTime = (block: Block) => {
    if (!block.messages.length) {
        return;
    }
    block.startTime = messageDict.value[block.messages[0]].time;
    block.endTime = messageDict.value[block.messages[block.messages.length - 1]].time;
}

export const loadMoreMessage = (id: number, blockId: number, side: string, done: any) => {
    startLoading();
    const block = messageBlocks.value[id][blockId];
    const {start, end} = side === "start" ? {start: 0, end: block.startTime} : {start: block.endTime, end: Date.now()};
    const direction = side;
    const num = 10;
    axios.get(BASE_API_URL + "chat/history", {
        params: {
            id,
            to: start,
            from: end,
            t_type: getUser(id).category === 'user' ? TargetType.FRIEND : TargetType.GROUP,
            num,
            alignment: direction === "start" ? "from" : "to",
        },
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        const pulled_messages = response.data as Array<Message>;
        const pulled_length = pulled_messages.length;
        const ids = pulled_messages.map((msg) => msg.message_id);
        for (const message of pulled_messages) {
            messageDict.value[message.message_id] = message;
        }
        // update messages
        if (messages.value[id] === undefined) {
            messages.value[id] = [];
        }
        const new_messages = [...messages.value[id], ...pulled_messages];
        // sort
        new_messages.sort((a, b) => a.time - b.time);
        // unique with id
        messages.value[id] = new_messages.filter((msg, index, self) => {
            return index == 0 || msg.message_id === self[index - 1].message_id;
        });
        // uniquely concat
        block.messages = [...new Set(direction === 'start' ? [...ids, ...block.messages] : [...block.messages, ...ids])];
        updateTime(block);
        return pulled_length;
    }).then((pulled_length) => {
        updateTime(block);
        mergeBlocks(id);
        if (pulled_length < 10) {
            done("empty");
        } else {
            done("ok");
        }
        endLoading();
    });
}

export const sortBlock = (block: Block) => {
    block.messages.sort((a, b) => {
        if (typeof a === "string") {
            if (typeof b === "string") return 0;    // stable
            return 1;
        } else {
            if (typeof b === "string") return -1;
            return a - b;
        }
    });
    block.messages = block.messages.filter((number, index, array) => index === 0 || number !== array[index - 1]);
    updateTime(block);
}

export const pullHot = (id: number, t_type: TargetType) => {
    axios.get(BASE_API_URL + "chat/history", {
        params: {
            id, from: Date.now(), t_type, num: 1,
        },
        headers: {
            Authorization: token.value,
        }
    }).then((response) => {
        const pulled_messages = response.data as Array<Message>;
        if (pulled_messages.length === 0) return;
        initMessageBlock(id);
        const blocks = messageBlocks.value[id];
        const block = blocks[blocks.length - 1];
        for (const msg of pulled_messages) {
            messageDict.value[msg.message_id] = msg;
            block.messages.push(msg.message_id);
        }
        sortBlock(block);
    });
}

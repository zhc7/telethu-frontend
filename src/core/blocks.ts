import {getAsyncMessage} from "./messages/receive.ts";
import {computed, ref} from "vue";
import {activeChatId, activeMessages, messageDict, user} from "../globals.ts";
import {Block} from "../utils/structs.ts";

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
            if (activeBlockId.value === i + 1) {
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
        scrollTo();
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
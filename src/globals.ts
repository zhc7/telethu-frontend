import {computed, ref} from 'vue';
import {useLocalStorage} from "@vueuse/core";
import {Users, Settings, UserData, Message} from "./utils/structs";


export const nowRef = ref(Date.now());
setInterval(() => {
    nowRef.value = Date.now();
}, 1000);
export const displayRightType = ref('');
export const activeChatId = ref<number>(-1);
export const contacts = useLocalStorage<Users>("contacts", {});
export const user = useLocalStorage<UserData>("user", {
    id: -1,
    name: "",
    email: "",
    avatar: "",
    category: "user",
})

export const userId = computed({
    get() {
        return user.value.id;
    },
    set(newValue) {
        user.value.id = newValue;
    },
})
export const userName = computed({
    get() {
        return user.value.name;
    },
    set(newValue) {
        user.value.name = newValue;
    }
})
export const userEmail = computed({
    get() {
        return user.value.email;
    },
    set(newValue) {
        user.value.email = newValue;
    }
})
export const isSocketConnected = ref(false);

export const settings = useLocalStorage<Settings>("settings", {
    pinned: [],
    muted: [],
    blocked: [],
});

export const messages = ref<{
    [id: number]: Array<Message>
}>({});

export const cache = ref<{
    [hash: string]: ArrayBuffer
}>({});

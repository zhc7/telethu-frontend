import {computed, ref} from 'vue';
import {useLocalStorage} from "@vueuse/core";
import {Contacts, Settings, User} from "./utils/structs";


export const nowRef = ref(Date.now());
setInterval(() => {
    nowRef.value = Date.now();
}, 1000);
export const displayRightType = ref('');
export const activeChatId = ref<number>(-1);
export const contacts = useLocalStorage<Contacts>("contacts", {});
export const user = useLocalStorage<User>("user", {
    id: -1,
    name: "",
    email: "",
    avatar: "",
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

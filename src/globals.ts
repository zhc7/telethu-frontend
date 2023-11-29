import {computed, ref} from 'vue';
import {useLocalStorage} from "@vueuse/core";
import {ChatListItem, ContactsData, Message, RequestListItem, Settings, UserData, Users} from "./utils/structs";


export const nowRef = ref<number>(Date.now());
setInterval(() => {
    nowRef.value = Date.now();
}, 1000);
export const currentPage = ref<string>('chat');
export const activeChatId = ref<number>(-1);
export const activeContactId = ref<number>(-1);
export const activeRequestId = ref<number>(-1);
export const contactPageContentLeft = ref<number>(0);

export const selectedContactInfo = ref<ContactsData | undefined>(undefined);
export const contactPageProfileSource = ref('contactList');

export const selectedChatInfo = ref<ContactsData | undefined>(undefined);
export const users = useLocalStorage<Users>("users", {});
export const contacts = ref<Array<number>>([]);
export const requests = ref<Array<number>>([]);
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
export const userAvatar = computed({
    get() {
        return user.value.avatar;
    },
    set(newValue) {
        user.value.avatar = newValue;
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
    [hash: string]: ArrayBuffer | undefined
}>({});

export const hotMessages = ref<{
    [id: number]: {
        sender: number,
        time: number,
        content: Message,
    } | undefined
}>({});


export const rawChatList = ref<Array<ChatListItem>>([]);

export const rawRequestList = ref<Array<RequestListItem>>([]);

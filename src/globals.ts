import {computed, ref, watch} from 'vue';
import {useLocalStorage} from "@vueuse/core";
import {ContactsData, Message, RequestListItem, Settings, UserData, Users} from "./utils/structs";
import {getUser, postSettings} from "./core/data.ts";
import MessagePop from "./components/MessagePop.vue";


export const nowRef = ref<number>(Date.now());
setInterval(() => {
    nowRef.value = Date.now();
}, 1000);
export const currentPage = ref<string>('chat');
export const activeChatId = ref<number>(-1);
export const activeContactId = ref<number>(-1);
export const activeRequestId = ref<number>(-1);
export const activeMessageId = ref<number>(-1);
export const referencingMessageId = ref<number>(-1);
export const searchedId = ref<number>(-1);
export const contactPageContentLeft = ref<number>(0);

export const selectedContactInfo = ref<ContactsData | undefined>(undefined);
export const contactPageProfileSource = ref('');

export const selectedChatInfo = ref<ContactsData | undefined>(undefined);
export const users = useLocalStorage<Users>("users", {});
export const contacts = ref<Array<number>>([]);
export const requests = ref<Array<number>>([]);
export const blacklist = ref<Array<number>>([]);
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

export const settingsUpdating = ref(false);
export const settings = ref<Settings>({
    muted: [],
    pinned: [],
    blocked: [],
});

watch(settings, () => {
    if (settingsUpdating.value) return;
    postSettings().then();
}, {
    deep: true,
});

export const messages = ref<{
    [id: number]: Array<Message>
}>({});

watch(contacts, () => {
    for (const id of contacts.value) {
        if (messages.value[id] === undefined) {
            messages.value[id] = [];
        }
    }
});

export const cache = ref<{
    [hash: string]: string
}>({});

export const hotMessages = ref<{
    [id: number]: {
        sender: number,
        time: number,
        content: Message,
    } | undefined
}>({});


export const rawRequestList = ref<Array<RequestListItem>>([]);

export const unreadCounter = ref<{ [id: number]: number }>({});

export const userContacts = computed(() => {
    return contacts.value.filter(i => (
        getUser(i).category === 'user'
    ))
})

export const groupPinnedMessages = ref<{
    [id: number]: Array<number>
}>({});

export const showProfileDialog = ref(false);

export const floatingContactId = ref(0);
export const showBigAvatar = ref(false);
export const bigAvatarSource = ref('');

export const activeMessages = ref<{
    [id: number]: InstanceType<typeof MessagePop>
}>({});
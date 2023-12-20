import {computed, ref, watch} from 'vue';
import {useLocalStorage} from "@vueuse/core";
import {ContactsData, Message, Settings, UserData, Users} from "./utils/structs";
import {getUser, postSettings} from "./core/data.ts";
import MessagePop from "./components/MessagePop.vue";
import MessageFlow from "./components/MessageFlow.vue";


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
export const activeSearchId = ref<number>(-1);
export const activeTagName = ref<string>('');
export const contactPageContentLeft = ref<number>(0);

export const selectedContactInfo = ref<ContactsData | undefined>(undefined);
export const contactPageProfileSource = ref('');

export const selectedChatInfo = ref<ContactsData | undefined>(undefined);
export const users = useLocalStorage<Users>("users", {});
export const contacts = ref<Array<number>>([]);
export const requests = ref<Array<number>>([]);
export const searchResults = ref<Array<UserData>>([]);
export const blacklist = ref<Array<number>>([]);
export const user = useLocalStorage<UserData>("user", {
    id: -1,
    name: "",
    email: "",
    avatar: "",
    category: "user",
    phone: '0',
    location: '',
})

export const userId = computed({
    get() {
        return user.value.id;
    },
    set(newValue) {
        user.value.id = newValue;
    },
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

export const settingsUpdating = ref(false);
export const settings = ref<Settings>({
    muted: [],
    pinned: [],
    location: '',
    phone: '',
    tags: {},
});

export const createNewTag = (name: string, target: number [] = []) => {
    if (settings.value.tags === undefined) {
        settings.value.tags = {};
    }
    if (Object.keys(settings.value.tags).includes(name)) {
        return -1;
    } else {
        settings.value.tags[name] = target;
        return 0;
    }
}

export const tagAddMember = (target: number [], name: string) => {
    if (settings.value.tags === undefined) {
        settings.value.tags = {};
    }
    if (!Object.keys(settings.value.tags).includes(name)) {
        settings.value.tags[name] = [];
    }
    for (const id of target) {
        if (!settings.value.tags[name].includes(id)) {
            settings.value.tags[name].push(id);
        }
    }
    return 0;
}

export const tagRemoveMember = (id: number, name: string) => {
    if (settings.value.tags === undefined) {
        settings.value.tags = {};
    }
    if (!Object.keys(settings.value.tags).includes(name)) {
        return -1;
    }
    const before = settings.value.tags[name].length;
    settings.value.tags[name] = settings.value.tags[name].filter(i => i !== id);
    const after = settings.value.tags[name].length;
    return before - after;
}

export const removeTag = (name: string) => {
    if (setting.value.tags === undefined) {
        settings.value.tags = {};
    }
    if (!Object.keys(settings.value.tags).includes(name)) {
        return -1;
    }
    delete settings.value.tags[name];
    return 0;
}


watch(settings, () => {
    if (settingsUpdating.value) return;
    postSettings().then();
}, {
    deep: true,
});

export const messages = ref<{
    [id: number]: Array<Message>
}>({});

export const messageDict = ref<{ [id: number | string]: Message }>({});

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

export const hotMessages = computed<{
    [id: number]: {
        sender: number,
        time: number,
        content: Message,
    } | undefined
}>(() => {
    const obj: {
        [id: number]: {
            sender: number,
            time: number,
            content: Message,
        } | undefined
    } = {};
    for (const id of contacts.value) {
        const msgs = messages.value[id];
        if (!msgs || msgs.length === 0) {
            obj[id] = undefined;
        } else {
            const msg = msgs[msgs.length - 1];
            obj[id] = {
                sender: msg.sender,
                time: msg.time,
                content: msg,
            }
        }
    }
    return obj;
});

export const editingMessage = ref<{
    [id: number]: string,
}>({});

export const unreadCounter = ref<{ [id: number]: number }>({});

export const userContacts = computed(() => {
    return contacts.value.filter(i => (
        getUser(i).category === 'user'
    ))
})

export const showProfileDialog = ref(false);

export const floatingContactId = ref(0);
export const showBigImage = ref(false);
export const bigImageSource = ref('');

export const activeMessages = ref<{
    [id: number]: InstanceType<typeof MessagePop>
}>({});

export const colors = useLocalStorage('colors', {});
export const defaultTheme = useLocalStorage('defaultTheme', 'light');
export const colorPickerDialog = ref(false);

export const messageFlow = ref<InstanceType<typeof MessageFlow> | null>(null);

export const snackbar = ref(false);
export const snackbarText = ref("");
export const snackbarColor = ref("red");
export const snackbarTimeout = ref(3000);
export const candidatesList = ref<{
    [id: number]: number []
}>([]);

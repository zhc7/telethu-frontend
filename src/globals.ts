import {computed, ref, watch} from 'vue';
import {useLocalStorage} from "@vueuse/core";
import {ContactsData, Message, RequestListItem, Settings, UserData, Users} from "./utils/structs";


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
    pinned: new Set(),
    muted: new Set(),
    blocked: new Set(),
}, {
    serializer: {
        read(raw: string): Settings {
            const data = JSON.parse(raw);
            console.log(data);
            for (const key in data) {
                data[key] = new Set(Object.keys(data[key]));
            }
            return data;
        },
        write(value: Settings): string {
            const data: { [key: string]: any } = {};
            for (const key in value) {
                const row: { [id: number]: number } = {};
                for (const item in value[key as keyof Settings]) {
                    row[+item] = 1;
                }
                data[key] = row;
            }
            return JSON.stringify(data);
        }
    }
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

export const UnreadCounter = ref<{ [id: number]: number }>({});
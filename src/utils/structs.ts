export enum MessageType {
    TEXT = 0,
    IMAGE = 1,
    AUDIO = 2,
    VIDEO = 3,
    FILE = 4,
    STICKER = 5,
    FUNCTION = 6,
    FUNC_CREATE_GROUP = 7,
    FUNC_ADD_GROUP_MEMBER = 8,
    FUNC_EXIT_GROUP = 9,
    FUNC_APPLY_FRIEND = 10,
    FUNC_ACCEPT_FRIEND = 11,
    FUNC_REJECT_FRIEND = 12,
    FUNC_BlOCK_FRIEND = 13,
    FUNC_DEL_FRIEND = 14,
    FUNC_READ_MSG = 15,
    FUNC_UPDATE_SETTINGS = 16,
    FUNC_UNBLOCK_FRIEND = 17,
    FUN_SEND_META = 18,
    FUNC_READ_MESSAGE = 19,
    FUNC_SB_EXIT_GROUP = 20,
    FUNC_SB_REMOVED_FROM_GROUP = 23,
}

export enum TargetType {
    FRIEND = 0,
    GROUP = 1,
    OTHER = 2,
}

export interface ContactsData {
    id: number,
    name: string,
    avatar: string,
    category: string,
}

export interface UserData extends ContactsData {
    email: string,
    category: "user",
}

export interface GroupData extends ContactsData {
    members: Array<number>,
    category: "group",
    owner: number,
    admin: Array<number>,
}

export interface Message {
    message_id: number | string,
    m_type: MessageType,
    t_type: TargetType,
    time: number,
    content: string | Array<any> | number | GroupData | UserData,
    sender: number,
    receiver: number,
    info?: string | Array<any>,
    status?: string; // pure frontend
}

export interface Ack {
    message_id: number,
    reference?: string,
}

export interface Users {
    [id: number]: UserData | GroupData,
}

export interface Settings {
    muted: Array<number>,
    pinned: Array<number>,
    blocked: Array<number>,
}

export interface ChatListItem {
    id: number,
    name: string,
    avatar: string,
    category: string,
    unread_counter: number,
    pin: boolean,
    mute: boolean,
    block: boolean,
}

export interface RequestListItem {
    id: number,
    name: string,
    avatar: string,
    email: string,
    time: number,
}
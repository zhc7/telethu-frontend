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
    FUNC_RECALL_SELF_MESSAGE = 9,
    FUNC_APPLY_FRIEND = 10,
    FUNC_ACCEPT_FRIEND = 11,
    FUNC_REJECT_FRIEND = 12,
    FUNC_BlOCK_FRIEND = 13,
    FUNC_DEL_FRIEND = 14,
    FUNC_CHANGE_GROUP_OWNER = 15,
    FUNC_UPDATE_SETTINGS = 16,
    FUNC_UNBLOCK_FRIEND = 17,
    FUN_SEND_META = 18,
    FUNC_READ_MESSAGE = 19,
    FUNC_LEAVE_GROUP = 20,
    FUNC_ADD_GROUP_ADMIN = 21,
    FUNC_REMOVE_GROUP_ADMIN = 22,
    FUNC_REMOVE_GROUP_MEMBER = 23,
    FUNC_MESSAGE_ADD_BROADCAST = 24,
    FUNC_MESSAGE_DEL_BROADCAST = 25,
    FUNC_CALLBACK_MEMBER_MESSAGE = 26,
    FUNC_DELETE_MESSAGE = 27,
    FUNC_EDIT_MESSAGE = 28,
    FUNC_EDIT_PROFILE = 29,
    FUNC_UNKNOWN_YET = 30,
    FUNC_GROUP_CHANGE_NAME = 31,
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
    top_message?: any,
}

export interface Message {
    message_id: number | string,
    m_type: MessageType,
    t_type: TargetType,
    time: number,
    content: string | Array<any> | number | GroupData | UserData,
    sender: number,
    receiver: number,
    info?: string | number | Array<any> | any,
    status?: number,
    pending_status?: string; // pure frontend
    who_read?: Array<number> | boolean, // group array, user boolean
}

export interface Ack {
    message_id: number,
    reference?: string,
}

export interface Users {
    [id: number]: ContactsData,
}

export interface Settings {
    muted: Array<number>,
    pinned: Array<number>,
    blocked: Array<number>,
}

export interface ChatListItemData {
    id: number,
    name: string,
    avatar: string,
    category: string,
    unread_counter: number,
    owner?: number,
    admin?: Array<number>,
    members?: Array<number>,
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

export type ContextMenuSubject = Message | "blank" | number;

export enum ArrayMenuItems {
    GroupShare = 'Group Share',
}

export enum MessageMenuItems {
    Copy = 'Copy',
    Share = 'Share',
    Select = 'Select',
    Delete = 'Delete',
    Withdraw = 'Withdraw',
}
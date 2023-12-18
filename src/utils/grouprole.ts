import {getUser} from "../core/data.ts";
import {GroupData} from "./structs.ts";

export const isAdmin = (id: number, groupId: number) => {
    const group = getUser(groupId);
    return group.category === 'group' && ((group as GroupData).admin.includes(id) || (group as GroupData).owner === id);
}

export const isOwner = (id: number, groupId: number) => {
    const group = getUser(groupId);
    return group.category === 'group' && (group as GroupData).owner === id;
}
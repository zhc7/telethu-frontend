import {ref} from 'vue';
export const nowRef = ref(Date.now());

const TimeUpdater = setInterval(() => {
    nowRef.value = Date.now();
}, 1000);

export const displayRightType = ref(undefined);
export const activeChat = ref(undefined);

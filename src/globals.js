import {ref} from 'vue';
export const nowRef = ref(new Date().getTime());

const TimeUpdater = setInterval(() => {
    nowRef.value = new Date().getTime();
}, 30000);
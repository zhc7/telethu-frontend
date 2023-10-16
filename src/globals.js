import {ref} from 'vue';

export const nowRef = ref(Date.now());

const TimeUpdater = setInterval(() => {
    console.log(Date.now());
    nowRef.value = Date.now();
}, 30000);
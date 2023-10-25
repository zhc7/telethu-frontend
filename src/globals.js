import {ref} from 'vue';

export const userRef = {
    'id': 'Shenium',
    'name': 'Shenium',
    'avatar': '/Shenium.png',
}
export const nowRef = ref(Date.now());

const TimeUpdater = setInterval(() => {
    nowRef.value = Date.now();
}, 1000);
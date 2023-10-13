import { ref } from "vue";
export const fakeChatList = ref([
    {
        'title': 'Alice',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2023, 9, 12, 17, 0, 0),
        'latest': 'Are you there? I am here, so is she. Hurry up!',
        'mute': false,
    },
    {
        'title': 'Bob',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2023, 9, 12, 0, 0, 0),
        'latest': 'Have fun!',
        'mute': false,
    },
    {
        'title': 'Cindy',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2023, 9, 10, 0, 0, 0),
        'latest': 'Wow, so cool!',
        'mute': true,
    },
    {
        'title': 'Dad',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2022, 1, 5, 0, 0, 0),
        'latest': 'I am your dad!',
        'mute': true,
    },
]);
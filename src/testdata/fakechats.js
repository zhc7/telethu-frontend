import { ref } from "vue";
export const fakeChatList = ref([
    {
        'title': 'Alice',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2023, 9, 12, 17, 23),
        'latest': 'Are you there?',
        'mute': false,
    },
    {
        'title': 'Bob',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2023, 9, 11, 19, 3, 2),
        'latest': 'Have fun!',
        'mute': false,
    },
    {
        'title': 'Cindy',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2023, 9, 6, 0, 0, 0),
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
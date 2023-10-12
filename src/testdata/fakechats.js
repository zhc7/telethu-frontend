import { ref } from "vue";
export const fakeChatList = ref([
    {
        'title': 'Alice',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2022, 1, 3, 0, 0, 0),
        'latest': 'Are you there?',
        'mute': false,
    },
    {
        'title': 'Bob',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2022, 1, 2, 0, 0, 0),
        'latest': 'Have fun!',
        'mute': false,
    },
    {
        'title': 'Cindy',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'time': Date.UTC(2022, 1, 1, 0, 0, 0),
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
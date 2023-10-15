import { ref } from "vue";
export const fakeChatList = ref([
    {
        'title': 'Alice',
        'id': 'Alice2004',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'editing': 'I am here ',
        'time': Date.UTC(2023, 9, 12, 17, 0, 0),
        'show': 'Are you there? I am here, so is she. Hurry up!',
        'mute': false,
    },
    {
        'title': 'Bob',
        'id': 'Bob2002',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'editing': '',
        'time': Date.UTC(2023, 9, 12, 0, 0, 0),
        'show': 'Have fun!',
        'mute': true,
    },
    {
        'title': 'Cindy',
        'id': 'Cindy2012',
        'prependAvatar': '../assets/download.jpeg',
        'type': 'person',
        'editing': '',
        'time': Date.UTC(2023, 9, 10, 0, 0, 0),
        'show': 'Wow, so cool!',
        'mute': true,
    },
]);
export const fakeContacts = {
    "2": {
        'title': 'Alice',
        "id": "2",
        'avatar': '/public/download.jpeg',
        'type': 'person',
        'editing': 'I am here ',
        'time': Date.UTC(2023, 9, 12, 17, 0, 0),
        'show': 'Are you there? I am here, so is she. Hurry up!',
        'mute': false,
        'block': false,
        'messages': [
            {
                'sender': 'Alice2004',
                'receiver': 'Shenium',
                'time': Date.UTC(2023, 9, 10, 0, 0, 0),
                'type': 'text',
                'content': 'Hello, are you there? ',
                'state': 'read',
            },
            {
                'sender': 'Alice2004',
                'receiver': 'Shenium',
                'time': Date.UTC(2023, 9, 10, 0, 0, 30),
                'type': 'text',
                'content': 'I have something urgent. ',
                'state': 'read',
            },
            {
                'sender': 'Shenium',
                'receiver': 'Alice',
                'time': Date.UTC(2023, 9, 10, 0, 1, 30),
                'type': 'text',
                'content': "What's up?",
                'state': 'read',
            },
            {
                'sender': 'Alice2004',
                'receiver': 'Shenium',
                'time': Date.UTC(2023, 9, 10, 0, 1, 45),
                'type': 'text',
                'content': 'Have you done your homework yet? ',
                'state': 'read',
            },
            {
                'sender': 'Shenium',
                'receiver': 'Alice2004',
                'time': Date.UTC(2023, 9, 10, 0, 2, 30),
                'type': 'text',
                'content': 'OMG, no! ',
                'state': 'read',
            },
            {
                'sender': 'Alice2004',
                'receiver': 'Shenium',
                'time': Date.UTC(2023, 9, 10, 0, 4, 30),
                'type': 'text',
                'content': 'Can you figure out how to solve the equation in problem 1.27? It seems that Riesz theorem fails to solve it. ',
                'state': 'read',
            },
        ],
    },
    "3": {
        'title': 'Bob',
        "id": "3",
        'avatar': '/public/download.jpeg',
        'type': 'person',
        'editing': '',
        'time': Date.UTC(2023, 9, 12, 0, 0, 0),
        'show': 'Have fun!',
        'mute': true,
        'block': false,
        'messages': [
            {
                'sender': 'Bob2002',
                'receiver': 'Shenium',
                'time': Date.UTC(2023, 9, 15, 1, 3, 30),
                'type': 'text',
                'content': 'Do you have time? ',
                'state': 'read',
            },
            {
                'sender': 'Shenium',
                'receiver': 'Bob2002',
                'time': Date.UTC(2023, 9, 15, 1, 4, 0),
                'type': 'text',
                'content': 'Sure! ',
                'state': 'sent',
            }
        ],
    },
    "4": {
        'title': 'Tom',
        "id": "4",
        'avatar': '/public/download.jpeg',
        'type': 'person',
        'editing': '',
        'time': Date.UTC(2023, 9, 10, 0, 0, 0),
        'show': 'Wow, so cool!',
        'mute': true,
        'block': false,
        'messages': [
            {
                'sender': 'Cindy2012',
                'receiver': 'Shenium',
                'time': Date.UTC(2023, 9, 14, 1, 4, 0),
                'type': 'text',
                'content': 'Sure! ',
                'state': 'sent',
            },
            {
                'sender': 'Cindy2012',
                'receiver': 'Shenium',
                'time': Date.UTC(2023, 9, 14, 1, 4, 0),
                'type': 'image',
                'content': 'public/Shenium.png',
                'state': 'sent',
            },
        ],
    },
};
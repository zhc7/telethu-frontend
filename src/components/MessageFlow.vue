<script setup>

import {ref} from "vue";

const messages = ref([]);
const inputMessage = ref('');

const userId = Math.floor(Math.random() * 100);

let socket = new WebSocket('ws://localhost:8000/ws/chat/1/');

socket.onopen = () => {
  console.log('WebSocket Client Connected');
};

socket.onmessage = (e) => {
  const message = JSON.parse(e.data);
  messages.value.push(message);
};

socket.onclose = (e) => {
  console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
  setTimeout(() => {
    socket = new WebSocket('ws://localhost:8000/ws/chat/1/');
  }, 1000);
};

socket.onerror = (err) => {
  console.error('Socket encountered error: ', err.message, 'Closing socket');
  socket.close();
};

const sendMessage = () => {
  if (inputMessage.value.trim() !== '') {
    const message = {
      stamp: Date.now(),
      user: 'User' + userId,
      message: inputMessage.value
    }
    socket.send(JSON.stringify(message))
    messages.value.push(message)
    inputMessage.value = ''
  }
}

</script>

<template>
  <div class="chat-container">
    <div v-for="message in messages" :key="message.id" class="message">
      <strong>{{ message.user }}</strong>: {{ message.message }}
    </div>
  </div>
  <div class="input-container">
    <input v-model="inputMessage" @keyup.enter="sendMessage" placeholder="请输入消息"/>
    <button @click="sendMessage">发送</button>
  </div>
</template>

<style scoped>
.chat-container {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    margin: 20px;
    padding: 10px;
}

.input-container {
    display: flex;
    margin: 20px;
}

.input-container input {
    flex-grow: 1;
    padding: 5px;
    margin-right: 10px;
}

.input-container button {
    padding: 5px 10px;
}
</style>
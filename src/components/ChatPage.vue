<script setup>
import {ref} from "vue";
import {fakeChatList} from "../testdata/fakechats.js";
import NavBar from "./NavBar.vue";
import ChatHeader from "./ChatHeader.vue";
import MessageArea from "./MessageArea.vue";
import MessageTextArea from "./MessageTextArea.vue";
import {ProcessMessage} from "../utils/messageutils.js"
import {FormatChatMessageTime} from "../utils/datetime.js"

const curTab = ref(1);
const chatList = ref(fakeChatList);

const selectedChat = ref(undefined);
const messages = ref([]);
</script>

<template>
  <v-container fluid>
    <v-row no-gutters align="center" justify="center" class="section">
      <NavBar @switch="newValue => {curTab = newValue}"></NavBar>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4">
        <v-list v-model="selectedChat">
          <div v-for="(chat, index) in chatList">
            <v-list-item :key="index"
                         :value="index"
                         @click="selectedChat = index"
                         align="left"
                         class="pa-3 pl-6 chat-list-item"
                         rounded="lg"
            >
              <template #prepend>
                <v-avatar><img src="../assets/download.jpeg" alt="avatar"/></v-avatar>
              </template>
              <v-list-item-title v-text="chat.title">
              </v-list-item-title>
              <v-list-item-subtitle>{{ chat.show }}</v-list-item-subtitle>
              <div class="chat-time">{{ FormatChatMessageTime(chat.time) }}</div>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </v-list>
      </v-col>
      <v-col class="middle-section">
        <ChatHeader :title="'abcd'"></ChatHeader>
        <MessageArea></MessageArea>
        <MessageTextArea></MessageTextArea>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.v-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0.2em;
}

.nav-section {
  margin-bottom: 2px;
}

.v-btn {
  font-size: 0.72em !important;
}

.chat-list-item {
  position: relative;
}

.chat-time {
  font-size: 0.75em;
  position: absolute;
  right: 0.8em;
  top: 1em;
  color: #888
}

.spacing-section {
  height: 10vh;
}
</style>

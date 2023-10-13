<script setup>
import {ref} from "vue";
import { fakeChatList } from "../testdata/fakechats.js";
import NavBar from "./NavBar.vue";
import ChatItem from "./ChatItem.vue";
import LogoHeader from "./LogoHeader.vue";


const curTab = ref(1);
const chatList = ref(fakeChatList);

const selectedChat = ref({});
const messages = ref([]);
</script>

<template>
  <v-container fluid>
    <v-row no-gutters align="center" justify="center" class="section">
      <NavBar @switch="newValue => {curTab = newValue}"></NavBar>
    </v-row>
    <v-divider class="border-opacity-50"></v-divider>
    <v-row no-gutters class="main-section">
      <v-col class="left-section">
        <LogoHeader></LogoHeader>
        <v-card class="chat-list">
          <v-divider class="border-opacity-50"></v-divider>
          <div v-for="(chat, index) in chatList" :key="index">
            <ChatItem :chat="chat" :index="index"></ChatItem>
          </div>
        </v-card>
      </v-col>
      <v-col class="middle-section">
        <v-row>
          <v-col cols="6">
            unimplemented
          </v-col>
        </v-row>
      </v-col>
      <!-- <v-col :cols="2" class="right-section">Right Part</v-col> -->
    </v-row>
  </v-container>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.v-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.nav-section {
  margin-bottom: 2px;
}

.v-btn {
  font-size: 0.72em !important;
}

.left-section {
  max-width: 300px;
  border: 1px solid;
}

.middle-section {
  border: 1px solid;
}

.chat-list {
  max-height: 1000px;
  height: 90vh;
  background-color: #333;
  color: #ddd;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
</style>

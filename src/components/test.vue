<script setup>
import {ref} from "vue";
import { fakeChatList } from "../testdata/fakechats.js";
import NavBar from "./NavBar.vue";
import ChatItem from "./ChatItem.vue";

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
        <v-card class="chat-list">
          <div class="chat-header">
            <v-card-item class="pt-3 pb-2">
              <template #subtitle>
                <span class="title-tele">Tele</span>
                <span class="title-THU">THU</span>
              </template>
            </v-card-item>
          </div>
          <v-divider class="border-opacity-50"></v-divider>
          <div v-for="(chat, index) in chatList" :key="index">
            <ChatItem :chat="chat" :index="index"></ChatItem>
          </div>
        </v-card>
      </v-col>
      <v-col class="middle-section">
        <v-row>
          <v-col cols="6">
            <v-text-field
                class="text-ellipsis"
                filled
                label="长文本示例"
                v-model="longText"
            ></v-text-field>
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
}

.middle-section {
  border: 1px solid;
}

.title-tele {
  background-color: black;
  color: orange;
  padding: 3px;
  font-weight: 1000;
  border-radius: 0 2px;
}

.title-THU {
  font-size: 0.9em;
  background-color: orange;
  color: black;
  padding: 3px;
  font-weight: 1000;
}

.chat-list {
  max-height: 1000px;
  height: 90vh;
  background-color: #333;
  color: #ddd;
  border: 1px solid;
  border-radius: 0;
}
</style>

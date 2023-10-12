<script setup>
import { ref, reactive } from "vue";
import { fakeChatList } from "../testdata/fakechats.js";
import { formatChatMessageTime } from "../utils/datetime.js";
const tab = ref(1);
const chatList = ref(fakeChatList);

const selectedChat = ref({});
const messages = ref([]);
</script>

<template>
  <v-container fluid>
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center" class="nav-section">
      <v-tab :value="1">CHAT</v-tab>
      <v-tab :value="2">CONTACTS</v-tab>
      <v-tab :value="3">SETTINGS</v-tab>
      <v-tab :value="4">PROFILE</v-tab>
    </v-tabs>
    <v-divider class="border-opacity-50"></v-divider>
    <v-row class="align-self-center align-content-center main-section">
      <v-col :cols="4" class="left-section">
        <v-card class="mx-auto flex-fixed chat-list">
          <div class="chat-header">
            <v-card-item class="pt-3 pb-2">
              <template #subtitle>
                <span class="title-tele">Tele</span
                ><span class="title-THU">THU</span>
              </template>
            </v-card-item>
          </div>
          <v-divider class="border-opacity-50"></v-divider>
          <div v-for="(chat, index) in chatList" :key="index">
            <v-row :key="index" align="center" class="chat-item">
              <v-col cols="3">
                <v-avatar size="2em">
                  <img src="../assets/download.jpeg" />
                </v-avatar>
              </v-col>
              <v-col>
                <v-row class="chat-title">
                  <span>{{ chat.title }}</span>
                </v-row>
                <v-row class="chat-detail">
                  {{ chat.latest }}
                </v-row>
              </v-col>
              <div class="chat-time">{{ formatChatMessageTime(chat.time) }}</div>
            </v-row>
            <!-- end chat-item -->
            <v-divider class="border-opacity-50"></v-divider>
          </div>
        </v-card>
      </v-col>
      <v-col :cols="8" class="middle-section">
        
      </v-col>
      <!-- <v-col :cols="2" class="right-section">Right Part</v-col> -->
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  width: 72vw;
  height: 100vh;
  margin: 0 auto;
  padding: 0;
}

.nav-section {
  margin-bottom: 2px;
}

.v-btn {
  font-size: 0.72em !important;
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

.chat-item {
  position: relative;
  margin: 0.2em;
  padding-top: 0.4em;
  padding-bottom: 0.4em;
}

.chat-title {
  font-weight: 800;
  color: #fff;
}

.chat-detail {
  font-weight: 300;
  color: #bbb;
  font-size: 0.9em;
}

.chat-time {
  position: absolute;
  right: 1em;
  top: 1em;
  font-size: 0.6em;
}
</style>

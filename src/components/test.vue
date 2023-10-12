<script setup>
import { ref, reactive } from "vue";
import { fakeChatList } from "../testdata/fakechats.js";
import { formatChatMessageTime } from "../utils/datetime.js";
const chatList = ref(fakeChatList);

const selectedChat = ref({});
const messages = ref([]);
</script>

<template>
  <v-container fluid>
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
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

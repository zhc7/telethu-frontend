<script setup>
import {ProcessMessage} from "../utils/messageutils.js";
import {formatChatMessageTime} from "../utils/datetime.js";

defineProps(['chat', 'index'])
</script>

<template>
    <v-row :key="index" align="center" class="chat-item">
      <v-col cols="3">
        <v-avatar size="2em">
          <img src="../assets/download.jpeg" alt="download"/>
        </v-avatar>
      </v-col>
      <v-col>
        <v-row class="chat-title">
          <span>{{ chat.title }}</span>
        </v-row>
        <v-row class="chat-detail">
          <span>{{ ProcessMessage(chat.latest) }}</span>
        </v-row>
      </v-col>
      <div class="chat-time">{{ formatChatMessageTime(chat.time) }}</div>
    </v-row>
    <!-- end chat-item -->
    <v-divider class="border-opacity-50"></v-divider>
</template>

<style scoped>
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

.chat-item {
  position: relative;
  margin: 0.2em;
  padding-top: 0.4em;
  padding-bottom: 0.4em;
}
</style>
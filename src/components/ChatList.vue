<script setup>
import {ProcessMessage} from "../utils/messageutils.js";
import {FormatChatMessageTime} from "../utils/datetime.js";

defineProps(['chatList']);
defineEmits(['select'])
</script>

<template>
  <v-list class="fill-height">
    <div v-for="chat in chatList">
      <v-list-item :key="chat.id"
                   :value="chat.id"
                   @click="$emit('select', chat.id)"
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
</template>

<style scoped>
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
</style>
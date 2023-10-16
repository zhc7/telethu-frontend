<script setup>
import {computed, ref} from "vue";
import {ProcessMessage} from "../utils/messageutils.js";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {fakeContacts} from "../testdata/fakechats.js";
import {nowRef} from "../globals.js";

defineEmits(['select']);
const chatList = ref(fakeContacts);

chatList.value.map((chat) => {
  if (chat.messages.length === 0) {
    chat.hotMessage = undefined;
  } else {
    chat.hotMessage = chat.messages[chat.messages.length - 1];
  }
  return chat;
});

const GetDisplayText = (chat) => {
  if (chat.messages.length === 0) {
    return '';
  }
  const lastIndex = chat.messages.length - 1;
  if (chat.messages[lastIndex].type !== 'text') {
    return chat.messages[lastIndex].type;
  }
  return chat.messages[lastIndex].content;
};

const GetDisplayTime = (chat) => {
  if (chat.messages.length === 0) {
    return '';
  }
  const lastIndex = chat.messages.length - 1;
  return FormatChatMessageTime(chat.messages[lastIndex].time);
}

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
                   color="primary"
      >
        <template #prepend>
          <v-avatar><v-img src="/public/download.jpeg" contain /></v-avatar>
        </template>
        <v-list-item-title v-text="chat.title">
        </v-list-item-title>
        <v-list-item-subtitle>{{ chat.hotMessage ? chat.hotMessage.content : '' }}</v-list-item-subtitle>
        <div class="chat-time">{{ chat.hotMessage ? FormatChatMessageTime(nowRef, chat.hotMessage.time) : '' }}</div>
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
  right: 1.6em;
  top: 1em;
  color: #888
}
</style>
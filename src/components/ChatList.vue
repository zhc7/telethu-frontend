<script setup>
import {computed, ref} from "vue";
import {ProcessMessage} from "../utils/messageutils.js";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {fakeContacts} from "../testdata/fakechats.js";
import {nowRef} from "../globals.js";
import List from "./List.vue";
import ListItem from "./ListItem.vue";

const props = defineProps(['modelValue'])
const emit = defineEmits(["update:modelValue"])
const chatList = ref(fakeContacts);
const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    console.log("list", value);
  }
});

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
  <List class="fill-height" v-model="selected">
    <ListItem
        :key="chat.id"
        :k="chat.id"
        align="left"
        class="pa-3 pl-6 chat-list-item"
        rounded="lg"
        v-for="chat in chatList"
    >
      <template #prepend>
        <v-avatar>
          <v-img src="/public/download.jpeg" contain/>
        </v-avatar>
      </template>
      <v-list-item-title v-text="chat.title">
      </v-list-item-title>
      <v-list-item-subtitle>{{ chat.hotMessage ? chat.hotMessage.content : '' }}</v-list-item-subtitle>
      <div class="chat-time">{{ chat.hotMessage ? FormatChatMessageTime(nowRef, chat.hotMessage.time) : '' }}</div>
    </ListItem>
  </List>
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

.v-list-item.v-list-item--active {
  background-color: #248aff !important;
  color: white !important;
}
.v-list-item.v-list-item--active .chat-time {
  color: white !important;
}
</style>
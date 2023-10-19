<script setup>
import {computed, ref, watch} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef} from "../globals.js";
import {contacts} from "../chat.js";
import List from "./List.vue";
import ListItem from "./ListItem.vue";

const props = defineProps(['modelValue'])
const emit = defineEmits(["update:modelValue"])
const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    console.log("list", value);
  }
});


// values of contacts.value
const chatList = ref();

const UpdateChatList = () => {
  chatList.value = Object.values(contacts.value).sort((a, b) => (a.time - b.time));
  chatList.value.map((chat) => {
    if (chat.messages.length === 0) {
      chat.hotMessage = undefined;
    } else {
      chat.hotMessage = chat.messages[chat.messages.length - 1];
    }
    return chat;
  });
}

UpdateChatList();

watch(contacts, UpdateChatList);
</script>

<template>
  <List class="fill-height" v-model="selected">
    <ListItem
        :key="chat.id"
        :k="chat.id"
        class="pa-3 pl-6 chat-list-item text-left"
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
</style>
<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef} from "../globals.js";
import {contacts} from "../chat.js";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import {DEBUG} from "../constants.js";

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
  if (DEBUG) {
    console.log("updating chat list", chatList.value);
  }
  chatList.value.map((chat) => {
    if (chat.messages === undefined) chat.messages = [];
    if (chat.messages.length === 0) {
      chat.hotMessage = undefined;
    } else {
      chat.hotMessage = chat.messages[chat.messages.length - 1];
    }
    return chat;
  });
}

watch(contacts, UpdateChatList);

onMounted(() => {
  console.log("chat list mounted");
  UpdateChatList();
})
</script>

<template>
  <List class="fill-height" v-model="selected">
    <v-list-item>
      <a href="https://ys.mihoyo.com/?utm_source=adbdpz&from_channel=adbdpz#/">TeleTHU</a>
    </v-list-item>
    <ListItem
        :key="chat.id"
        :k="chat.id"
        class="pa-3 pl-6 chat-list-item text-left"
        rounded="lg"
        v-for="chat in chatList"
        :title="chat.username"
        :subtitle="chat.hotMessage ? chat.hotMessage.content : ''"
    >
      <template #prepend>
        <v-avatar>
          <v-img :src="chat.avatar" cover/>
        </v-avatar>
      </template>
      <div class="chat-time fill-height">{{ chat.hotMessage ? FormatChatMessageTime(nowRef, chat.hotMessage.time) : '' }}</div>
      <template #append>
        <v-badge color="red" content="1" inline></v-badge>
      </template>
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
  right: 4em;
  top: 2em;
  color: #888
}
</style>
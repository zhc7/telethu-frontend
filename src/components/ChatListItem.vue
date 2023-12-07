<script setup lang="ts">
import {hotMessages, nowRef, settings, unreadCounter} from "../globals";
import {formatChatMessageTime} from "../utils/datetime";
import {Message} from "../utils/structs";
import {computed} from "vue";
import ListItem from "./ListItem.vue";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";


const props = defineProps<{
  contactId: number,
}>();


const displayHotMessage = (message: Message | undefined) => {
  const types = ['text', 'image', 'audio', 'video', 'file', 'stickers'];
  if (message === undefined) {
    return '';
  } else if (message.m_type === 0) {
    return message.content;
  } else {
    return '[' + types[message.m_type] + ']';
  }
}

const contact = computed(() => getUser(props.contactId));

const pin = computed(() => {
  return settings.value.pinned.includes(props.contactId);
})

const mute = computed(() => {
  return settings.value.muted.includes(props.contactId);
})

const unread = computed<number>(() => {
  return unreadCounter.value[props.contactId] || 0;
});
</script>

<template>
  <ListItem
      :k="contactId"
      class="pa-3 pl-6 chat-list-item text-left hot-message"
      rounded="lg"
      :title="contact.name"
      :subtitle="displayHotMessage(hotMessages[contactId]?.content)"
  >
    <template #prepend>
      <div style="position: relative">
        <div class="badge" v-if="unreadCounter[contactId]">{{ unreadCounter[contactId] }}</div>
        <Avatar :contact-id="contactId"/>
      </div>

    </template>
    <div class="chat-time fill-height">
      <p>{{ hotMessages[contactId] ? formatChatMessageTime(nowRef, hotMessages[contactId]?.time) : '' }}</p>
    </div>
    <template #append>
      <v-icon v-if="pin" size="xs">mdi-pin</v-icon>
      <v-icon v-else size="xs"></v-icon>
      <v-icon v-if="mute" size="xs">mdi-bell-off</v-icon>
      <v-icon v-else size="xs"></v-icon>
    </template>
  </ListItem>
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

.badge {
  position: absolute;
  height: 16px;
  width: 16px;
  line-height: 16px;
  right: -0.36em;
  top: -0.4em;
  font-size: 0.56em;
  z-index: 10000;
  background-color: red;
  border-radius: 7px;
  color: white;
  text-align: center;
  font-weight: 700;
}
</style>
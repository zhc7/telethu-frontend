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
})
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
      <Avatar :contact-id="contactId"/>
    </template>
    <div class="chat-time fill-height">
      <p>{{ hotMessages[contactId] ? formatChatMessageTime(nowRef, hotMessages[contactId]?.time) : '' }}</p>
    </div>
    <template #append>
      <v-icon v-show="pin">mdi-pin</v-icon>
      <v-icon v-show="mute">mdi-bell-off</v-icon>
      <v-badge class="unread-counter-badge" v-if="!mute && unread" color="red" :content="unread" inline></v-badge>
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

.unread-counter-badge {
  position: absolute;
  overflow: visible;
  right: -10px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: red;
  color: white;
  line-height: 16px;
  font-size: 14px;
  z-index: 100000;
}
</style>
<script setup lang="ts">
import {hotMessages, nowRef, settings, unreadCounter} from "../globals";
import {formatChatMessageTime} from "../utils/datetime";
import {computed} from "vue";
import ListItem from "./ListItem.vue";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";
import {displayHotMessage} from "../utils/notification.ts";


const props = defineProps<{
  contactId: number,
}>();


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
      :unread="unread > 0"
  >
    <template #prepend>
      <div style="position: relative">
        <div class="badge" v-if="unreadCounter[contactId] && !settings.muted.includes(contactId)">
          {{ unreadCounter[contactId] }}
        </div>
        <Avatar :contact-id="contactId"/>
      </div>

    </template>
    <template #append>
      <div class="chat-time fill-height text-right">
        <p>{{ hotMessages[contactId] ? formatChatMessageTime(nowRef, hotMessages[contactId]?.time) : '' }}</p>
      </div>
      <div class="d-flex justify-end">
        <v-icon v-if="pin" size="xs">mdi-pin</v-icon>
        <v-icon v-if="mute" size="xs">mdi-bell-off</v-icon>
      </div>
    </template>
  </ListItem>
</template>

<style scoped>
.chat-list-item {
  position: relative;
}

.chat-time {
  font-size: 0.75em;
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
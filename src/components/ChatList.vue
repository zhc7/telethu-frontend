<script setup lang="ts">
import {computed, ref} from "vue";
import {formatChatMessageTime} from "../utils/datetime.ts";
import {activeChatId, hotMessages, nowRef, rawChatList, selectedChatInfo} from "../globals.ts";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import SelectMember from "./SelectMember.vue";
import {ChatListItem, Message} from "../utils/structs.ts";
import Avatar from "./Avatar.vue";

const createGroupDialog = ref(false);

const chatList = computed(() => {
  const filtered = rawChatList.value.filter((i): i is ChatListItem => i !== undefined);
  return filtered.sort((a, b) => {
    if (a.pin === b.pin) {
      const hot_a = hotMessages.value[a.id];
      const hot_b = hotMessages.value[b.id];
      if (hot_a === undefined) return 1;
      if (hot_b === undefined) return -1;
      return hot_b.time - hot_a.time;
    } else if (a.pin) {
      return -1;
    } else if (b.pin) {
      return 1;
    }
    throw new Error('error in chatList computing ' + a.pin + b.pin);
  });
});

const searchFriendInput = ref(false);
const friendName = ref('');

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
</script>

<template>
  <div class="fill-height d-flex flex-column">
    <SelectMember
        :showDialog="createGroupDialog"
        @update:showDialog="createGroupDialog = $event"
        source="chatList"
        title="Create Group"
    />
    <div class="d-flex mt-3" style="justify-content: space-between">
      <v-icon class="ma-3" @click="searchFriendInput = !searchFriendInput">mdi-magnify</v-icon>
      <a v-if="!searchFriendInput" class="ma-3"
         href="https://ys.mihoyo.com/?utm_source=adbdpz&from_channel=adbdpz#/">{{ selectedChatInfo?.id }}</a>
      <v-icon v-if="!searchFriendInput" class="ma-3" @click="createGroupDialog = true;">mdi-plus</v-icon>
      <v-text-field v-if="searchFriendInput" hide-details v-model="friendName"
                    density="compact" variant="solo" class="mr-4"/>
    </div>
    <List class="overflow-y-auto fill-height" v-model="activeChatId">
      <ListItem
          :key="chat.id"
          :k="chat.id"
          class="pa-3 pl-6 chat-list-item text-left hot-message"
          rounded="lg"
          v-for="chat in chatList"
          :title="chat.name"
          :subtitle="displayHotMessage(hotMessages[chat.id]?.content)"
      >
        <template #prepend>
          <Avatar :contact-id="chat.id"/>
        </template>
        <div class="chat-time fill-height">
          <p>{{ hotMessages[chat.id] ? formatChatMessageTime(nowRef, hotMessages[chat.id]?.time) : '' }}</p>
          <v-icon v-show="chat.pin">mdi-pin</v-icon>
          <v-icon v-show="chat.mute">mdi-bell-off</v-icon>
        </div>
        <template #append>
          <v-badge v-if="!chat.mute && chat.unread_counter" color="red" :content="chat.unread_counter" inline></v-badge>
        </template>
      </ListItem>
    </List>
  </div>
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
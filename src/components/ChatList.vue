<script setup lang="ts">
import {computed, ref} from "vue";
import {
  activeChatId,
  contacts,
  hotMessages,
  messages,
  selectedChatInfo,
  settings,
  user,
  userContacts
} from "../globals.ts";
import List from "./List.vue";
import SelectMember from "./SelectMember.vue";
import {getUser} from "../core/data.ts";
import ChatListItem from "./ChatListItem.vue";
import ListItem from "./ListItem.vue";

import {createGroup} from "../core/groups/send.ts";
import MessagePop from "./MessagePop.vue";
import MessagePopItem from "./MessagePopItem.vue";
import {Message, MessageType} from "../utils/structs.ts";

const createGroupDialog = ref(false);

const chatList = computed(() => {
  return contacts.value.sort((aId, bId) => {
    const a = getUser(aId);
    const b = getUser(bId);
    const aPinned = settings.value.pinned.includes(aId);
    const bPinned = settings.value.pinned.includes(bId);
    if (aPinned === bPinned) {
      const hot_a = hotMessages.value[a.id];
      const hot_b = hotMessages.value[b.id];
      if (hot_a === undefined) return 1;
      if (hot_b === undefined) return -1;
      return hot_b.time - hot_a.time;
    } else if (aPinned) {
      return -1;
    } else {
      // bPinned
      return 1;
    }
  });
});

const searchFriendInput = ref(false);
const searchText = ref('');

const decideRelative = (msg: Message, str: string) => {
  if (msg.m_type === MessageType.TEXT) {
    if (msg.content instanceof Array) {
      for (const submsg of msg.content) {
        if (decideRelative(submsg, str)) return true;
      }
      return false;
    }
    if (typeof(msg.content) === 'string') {
      return msg.content.includes(str);
    }
  }
  return false;
}

const filteredMessages = computed(() => {
  const list = [];
  for (const id of Object.keys(messages.value)) {
    for (const msg of messages.value[+id]) {
      if (decideRelative(msg, searchText.value)) {
        list.push(msg.message_id);
      }
    }
  }
  return list;
})

</script>

<template>
  <div class="fill-height d-flex flex-column">
    <SelectMember
        v-model:show-dialog="createGroupDialog"
        :pinned="[user.id]"
        :possible="userContacts"
        title="Create Group"
        @confirm="(list, name) => {
          createGroupDialog=false;
          return createGroup(name, list);
        }"
    />

    <div class="d-flex mt-3" style="justify-content: space-between">
      <v-icon class="ma-3" @click="searchFriendInput = !searchFriendInput">mdi-magnify</v-icon>
      <a v-if="!searchFriendInput" class="ma-3"
         href="https://ys.mihoyo.com/?utm_source=adbdpz&from_channel=adbdpz#/">TeleTHU</a>
      <v-icon v-if="!searchFriendInput" class="ma-3" @click="createGroupDialog = true;">mdi-plus</v-icon>
      <v-text-field v-if="searchFriendInput" hide-details v-model="searchText"
                    density="compact" variant="solo" class="mr-4"/>
    </div>
    <List class="overflow-y-auto fill-height" v-model="activeChatId" v-if="!searchFriendInput || !searchText">
      <ChatListItem v-for="id in chatList" :contact-id="id"/>
    </List>
    <List class="overflow-y-auto fill-height" v-else>
      <MessagePopItem
          v-for="msgid in filteredMessages"
          :message-id="msgid as string"
      ></MessagePopItem>
    </List>
  </div>
</template>

<style scoped>

</style>
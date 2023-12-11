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
import {handleCreateGroup} from "../core/groups/receive.ts";

import {createGroup} from "../core/groups/send.ts";

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

const searchChatHistory = ref(false);
const chatHistoryContent = ref('');

// TODO: search chat history
const chatHistoryList = computed(() => {
  if (searchChatHistory.value) {
    let matchMessages = [];
    for (const id of contacts.value) {
      for (const message of messages.value[id]) {
        if (typeof message.content !== 'string') continue;
        if (message.content.includes(chatHistoryContent.value)) {
          matchMessages.push(message);
        }
      }
    }
    return matchMessages.sort((a, b) => {
      return b.time - a.time;
    });
  } else {
    return [];
  }
});

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
      <v-icon class="ma-3" @click="searchChatHistory = !searchChatHistory">mdi-magnify</v-icon>
      <a v-if="!searchChatHistory" class="ma-3"
         href="https://ys.mihoyo.com/?utm_source=adbdpz&from_channel=adbdpz#/">TeleTHU</a>
      <v-icon v-if="!searchChatHistory" class="ma-3" @click="createGroupDialog = true;">mdi-plus</v-icon>
      <v-text-field v-if="searchChatHistory" hide-details v-model="chatHistoryContent" label="Search Chat History"
                    density="compact" variant="solo" class="mr-4"/>
    </div>
    <List class="overflow-y-auto fill-height" v-model="activeChatId">
      <ChatListItem v-for="id in chatList" v-if="!searchChatHistory" :contact-id="id"/>
      <ChatListItem v-for="message in chatHistoryList" v-if="searchChatHistory" :contact-id="message.sender"/>
    </List>
  </div>
</template>

<style scoped>

</style>
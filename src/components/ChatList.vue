<script setup lang="ts">
import {computed, ref} from "vue";
import {activeChatId, contacts, hotMessages, selectedChatInfo, settings, user, userContacts} from "../globals.ts";
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

const searchFriendInput = ref(false);
const friendName = ref('');

const testFunc = (a, b) => {
  alert(a);
  alert(b);
}

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
         href="https://ys.mihoyo.com/?utm_source=adbdpz&from_channel=adbdpz#/">{{ selectedChatInfo?.id }}</a>
      <v-icon v-if="!searchFriendInput" class="ma-3" @click="createGroupDialog = true;">mdi-plus</v-icon>
      <v-text-field v-if="searchFriendInput" hide-details v-model="friendName"
                    density="compact" variant="solo" class="mr-4"/>
    </div>
    <List class="overflow-y-auto fill-height" v-model="activeChatId">
      <ChatListItem v-for="id in chatList" :contact-id="id"/>
    </List>
  </div>
</template>

<style scoped>

</style>
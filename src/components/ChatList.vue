<script setup lang="ts">
import ListItem from "./ListItem.vue";
import {computed, ref, watch} from "vue";
import {createGroup} from "../core/groups/send.ts";
import {
  activeChatId,
  activeMessageId,
  contacts,
  hotMessages, messageDict,
  messages,
  settings,
  user,
  userContacts,
  users
} from "../globals.ts";
import List from "./List.vue";
import SelectMember from "./SelectMember.vue";
import {getUser} from "../core/data.ts";
import ChatListItem from "./ChatListItem.vue";
import MessagePopItem from "./MessagePopItem.vue";
import {Message, MessageType} from "../utils/structs.ts";
import Avatar from "./Avatar.vue";
import list from "./List.vue";
import {DEBUG} from "../constants.ts";

const createGroupDialog = ref(false);

defineProps<{
  modelValue: boolean,
}>();

const emit = defineEmits(['update:modelValue'])

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
  if (!msg) return;
  const strList = str.split(' ');
  if (msg.m_type === MessageType.TEXT) {
    if (msg.content instanceof Array) {
      for (const submsg of msg.content) {
        if (decideRelative(submsg, str)) return true;
      }
      return false;
    }
    if (typeof (msg.content) === 'string') {
      let flag = true;
      strList.forEach((word) => {
        if (!(msg.content as string).includes(word)) {
          flag = false;
        }
      });
      return flag;
    }
  }
  return false;
}

const filteredMessages = computed(() => {
  const list = [];
  for (const id of Object.keys(messages.value)) {
    for (const msg of messages.value[id]) {
      if (decideRelative(msg, searchText.value)) {
        list.push(msg);
      }
    }
  }
  return list.sort((a, b) => {
    return b.time - a.time;
  });
});

const filteredContact = computed(() => {
  const list = [];
  for (const id of contacts.value) {
    if (getUser(id).name.includes(searchText.value)) {
      list.push(id);
    }
  }
  return list;
})

watch(searchFriendInput, () => {
  if (DEBUG) console.log('messages', messages.value);
  emit('update:modelValue', searchText.value && searchFriendInput.value);
});

watch(searchText, () => {
  emit('update:modelValue', searchText.value && searchFriendInput.value);
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
          createGroup(name, list);
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

    <template v-else>
      <v-list-item ma="6" class="bg-grey-lighten-3" v-if="filteredContact.length">
        Contacts ({{filteredContact.length}})
      </v-list-item>
      <List @click="activeMessageId=-1" v-if="filteredContact.length" class="overflow-y-auto" v-model="activeChatId" min-height="15vh">
        <ListItem v-for="id in filteredContact"
                  :k="id"
                  :title="users[id].name"
                  :subtitle="'@' + id"
        >
          <template #prepend>
            <Avatar :contact-id="id"/>
          </template>
        </ListItem>
      </List>
      <v-list-item ma="6" class="bg-grey-lighten-3" v-if="filteredMessages.length">
        Chats ({{filteredMessages.length}})
      </v-list-item>
      <List v-if="filteredMessages.length" class="overflow-y-auto" v-model="activeMessageId" min-height="15vh">
        <MessagePopItem
            v-for="msg in filteredMessages"
            :message-id="msg.message_id as number"
            :active="false"
        />
      </List>
      <span v-if="!filteredMessages.length && !filteredContact.length" class="text-center mt-5">No result</span>
    </template>

  </div>
</template>

<style scoped>

</style>
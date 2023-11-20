<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.ts";
import {nowRef, activeChatId, contacts, user, settings} from "../globals.ts";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import SelectMember from "./SelectMember.vue";
import axios from "axios";
import {BASE_API_URL} from "../constants.ts";
import {token} from "../auth.ts";

defineProps(['modelValue']);

const createGroupDialog = ref(false);

const chatList = computed(() => {
  let list = [];
  for (let _id in contacts.value) {
    const id = + _id;
    const contact = contacts.value[id];
    list.push({
      id: id,
      name: contact.name,
      avatar: contact.avatar,
      category: contact.category,
      hotMessage: contact.messages[contact.messages.length - 1],
      unread_counter: contact.unread_counter,
      // TODO: persist pin, mute, block
      pin: settings.value.pinned.includes(id),
      mute: settings.value.muted.includes(id),
      block: settings.value.blocked.includes(id),
    })
  }
  list = list.sort((a, b) => {
    if (a.hotMessage && b.hotMessage) {
      if (a.pin && b.pin) {
        return b.hotMessage.time - a.hotMessage.time;
      } else if (a.pin) {
        return -1;
      } else if (b.pin) {
        return 1;
      } else {
        return b.hotMessage.time - a.hotMessage.time;
      }
    } else if (a.hotMessage) {
      return -1;
    } else if (b.hotMessage) {
      return 1;
    } else {
      return 0;
    }
  });
  list = list.filter((chat) => {
    return chat.name.toLowerCase().indexOf(friendName.value.toLowerCase()) !== -1;
  });
  return list;
});

const searchFriendInput = ref(false);
const friendName = ref('');

const displayHotMessage = (message) => {
  const types = ['text', 'image', 'audio', 'video', 'file', 'stickers'];
  if (message === undefined) {
    return '';
  } else if (message.m_type === 0) {
    return message.content;
  } else {
    return '[' + types[message.m_type] + ']';
  }
}

onMounted(async () => {
  const response = await axios.get(`${BASE_API_URL}users/avatar/`, {
    headers: {
      Authorization: token.value,
    },
    responseType: 'blob',
  }).catch((error) => {
    console.error('Http get avatar failed -> ', error);
  });
  const reader = new FileReader();
  reader.readAsDataURL(response.data); // change Blob into Base64
  reader.onloadend = function () {
    user.value.avatar = reader.result;
  };

  for (const id in contacts.value) {
    console.log('get avatar for ', id, contacts.value[id].avatar);
    if (!contacts.value[id].avatar_storage) {
      const response = await axios.get(`${BASE_API_URL}users/avatar/${contacts.value[id].avatar}`, {
        headers: {
          Authorization: token.value,
        },
        responseType: 'blob',
      }).catch((error) => {
        console.error('Http get avatar failed -> ', error);
      });
      const reader = new FileReader();
      reader.readAsDataURL(response.data); // change Blob into Base64
      reader.onloadend = function () {
        contacts.value[id].avatar_storage = reader.result;
      };
    }
  }
})
</script>

<template>
  <SelectMember
      :showDialog="createGroupDialog"
      @update:showDialog="createGroupDialog = $event"
      :type="'create_group'"
      :title="'Create Group'"
  />


  <div class="fill-height d-flex flex-column">
    <div class="d-flex mt-3" style="justify-content: space-between">
      <v-icon class="ma-3" @click="searchFriendInput = !searchFriendInput">mdi-magnify</v-icon>
      <a v-if="!searchFriendInput" class="ma-3"
         href="https://ys.mihoyo.com/?utm_source=adbdpz&from_channel=adbdpz#/">{{ activeChatId }}</a>
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
          :subtitle="displayHotMessage(chat.hotMessage)"
      >
        <template #prepend>
          <v-avatar>
            <v-img v-if="chat.category === 'user'" :src="chat.avatar_storage" cover/>
            <v-icon v-else>mdi-account-multiple</v-icon>
          </v-avatar>
        </template>
        <div class="chat-time fill-height">
          <p>{{ chat.hotMessage ? FormatChatMessageTime(nowRef, chat.hotMessage.time) : '' }}</p>
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
</style>
<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef} from "../globals.js";
import {contacts} from "../chat.js";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import {createGroup} from "../chat.js";

const props = defineProps(['modelValue'])
const emit = defineEmits(["update:modelValue"])
const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    console.log("list", value);
  }
});

const createGroupDialog = ref(false);
const createGroupLoading = ref(false);
const createGroupName = ref('New Group');
const createGroupSelecting = ref([]);

const handleCreateGroup = () => {
  console.log("creating group", createGroupSelecting);
  createGroupLoading.value = true;
  createGroup(createGroupName.value, createGroupSelecting.value);
  createGroupSelecting.value = [];
  createGroupLoading.value = false;
  createGroupDialog.value = false;
}

const chatList = computed(() => {
  let list = [];
  for (let id in contacts.value) {
    const contact = contacts.value[id];
    list.push({
      id: id,
      name: contact.name,
      avatar: contact.avatar,
      category: contact.category,
      hotMessage: contact.messages[contact.messages.length - 1],
      alert: contact.alert,
      // TODO: persist pin, mute, block
      pin: contact.pin,
      mute: contact.mute,
      block: contact.block,
    })
  }
  list = list.sort((a, b) => {
    if (a.hotMessage && b.hotMessage) {
      return b.hotMessage.time - a.hotMessage.time;
    } else if (a.hotMessage) {
      return -1;
    } else if (b.hotMessage) {
      return 1;
    } else {
      return 0;
    }
  });
  return list;
});

const sortedChatList = computed(() => {
  let list = chatList.value.slice();
  list.sort((a, b) => {
    if (a.pin && b.pin) {
      return 0;
    } else if (a.pin) {
      return -1;
    } else if (b.pin) {
      return 1;
    } else {
      return 0;
    }
  });
  list = list.filter((chat) => {
    return chat.name.toLowerCase().indexOf(friendName.value.toLowerCase()) !== -1;
  });
  return list;
})

const searchFriendInput = ref(false);
const friendName = ref('');


const handlePlus = () => {
  createGroupDialog.value = true;
}

const handleCancel = () => {
  createGroupDialog.value = false;
  createGroupSelecting.value = [];
}

const filterContacts = computed(() => {
  return Object.keys(contacts.value).filter((id) => {
    return contacts.value[id].category === 'user' && (createGroupSelecting.value.indexOf(id) === -1);
  }).map((id) => {
    return {
      id: id,
      name: contacts.value[id].name,
      avatar: contacts.value[id].avatar,
    }
  });
});

const displayHotMessage = (message) => {
  if (message === undefined) {
    return '';
  } else if (message.m_type === 0) {
    return message.content;
  } else if (message.m_type === 1) {
    return '[image]';
  } else if (message.m_type === 2) {
    return '[audio]';
  } else if (message.m_type === 3) {
    return '[video]';
  } else if (message.m_type === 4) {
    return '[file]';
  } else if (message.m_type === 5) {
    return '[stickers]';
  } else {
    return '[unknown]';
  }
}

onMounted(() => {
  console.log("chat list mounted");
})
</script>

<template>
  <v-dialog v-model="createGroupDialog" max-width="30vw">
    <v-card>
      <v-card-title class="text-center">
        Create Group
      </v-card-title>
      <v-card-text>
        <v-text-field
            density="compact"
            label="group name"
            v-model="createGroupName"
            variant="outlined"
        />
        <v-text-field
            density="compact"
            label="Search"
        />
        <div class="d-flex overflow-x-auto" v-if="createGroupSelecting">
          <div
              v-for="id in createGroupSelecting"
              :key="id"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              @click="createGroupSelecting = createGroupSelecting.filter((i) => i !== id)"
              v-ripple
          >
            <v-avatar>
              <v-img :src="contacts[id].avatar" cover></v-img>
            </v-avatar>
            <p>{{ contacts[id].name }}</p>
          </div>
        </div>
        <v-list>
          <v-list-item v-for="contact in filterContacts">
            <template #prepend>
              <v-avatar>
                <v-img :src="contact.avatar" cover></v-img>
              </v-avatar>
            </template>
            <v-list-item-title>
              {{ contact.name }}
            </v-list-item-title>
            <template #append>
              <v-btn @click="createGroupSelecting.push(contact.id)" color="indigo">
                Append
                <template #append>
                  <v-icon>mdi-account-circle</v-icon>
                </template>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer/>
        <v-btn @click="handleCancel">Cancel</v-btn>
        <v-btn @click="handleCreateGroup" :loading="createGroupLoading">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <div class="fill-height d-flex flex-column">
    <div class="d-flex mt-3" style="justify-content: space-between">
      <v-icon class="ma-3" @click="searchFriendInput = !searchFriendInput">mdi-magnify</v-icon>
      <a v-if="!searchFriendInput" class="ma-3" href="https://ys.mihoyo.com/?utm_source=adbdpz&from_channel=adbdpz#/">TeleTHU</a>
      <v-icon v-if="!searchFriendInput" class="ma-3" @click="handlePlus">mdi-plus</v-icon>
      <v-text-field v-if="searchFriendInput" hide-details v-model="friendName"
                    density="compact" variant="solo" class="mr-4"/>
    </div>
    <List class="overflow-y-auto fill-height" v-model="selected">
      <div v-for="chat in sortedChatList">
        <ListItem
            :key="chat.id"
            :k="chat.id"
            class="pa-3 pl-6 chat-list-item text-left hot-message"
            rounded="lg"
            :title="chat.name"
            :subtitle="displayHotMessage(chat.hotMessage)"
        >
          <template #prepend>
            <v-avatar>
              <v-img v-if="chat.category === 'user'" :src="chat.avatar" cover/>
              <v-icon v-else>mdi-account-multiple</v-icon>
            </v-avatar>
          </template>
          <div class="chat-time fill-height">
            <p>{{ chat.hotMessage ? FormatChatMessageTime(nowRef, chat.hotMessage.time) : '' }}</p>
            <v-icon v-show="chat.pin">mdi-pin</v-icon>
            <v-icon v-show="chat.mute">mdi-bell-off</v-icon>
          </div>
          <template #append>
            <v-badge v-if="chat.alert && !chat.mute" color="red" content="1" inline></v-badge>
          </template>
        </ListItem>
        <v-divider v-if="chat !== sortedChatList[sortedChatList.length - 1]"/>
      </div>
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
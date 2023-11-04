<script setup>

import ChatList from "./ChatList.vue";
import MessagePop from "./MessagePop.vue";
import {computed, onMounted, ref} from "vue";
import {contacts, getHistoryMessage, sendMessage} from "../chat.js";
import ContactProfile from "./ContactProfile.vue";
import {DEBUG} from "../constants.js";
import {userId, userName} from "../auth.js";
import InputArea from "./InputArea.vue";

const props = defineProps(["modelValue"])
const emit = defineEmits(['update:modelValue']);
const displayProfile = ref(undefined);
const showProfileDetail = ref(false);

const selectedChatId = computed({
  get: () => props.modelValue,
  set: (value) => {
    contacts.value[value].alert = false;
    emit('update:modelValue', value);
  }
});

const selectedChat = computed(() => contacts.value[selectedChatId.value]);

const ScrollToBottom = () => {
  const container = document.getElementById('message-flow');
  container.scrollTop = container.scrollHeight;
};

const displayContact = ref();
const DisplayFriendProfile = () => {
  displayProfile.value = contacts.value[selectedChatId.value].category;
  window.setTimeout(() => {
    showProfileDetail.value = true;
  }, 300);
  displayContact.value = contacts.value[selectedChatId.value];
};

const handleHideProfile = (event) => {
  const target = event.target.parentNode.parentNode;
  if (target.classList.contains('v-avatar') || target.classList.contains('v-btn')) {
    console.log('is child')
  } else {
    displayProfile.value = undefined;
    showProfileDetail.value = false;
    window.setTimeout(() => {
      showProfileDetail.value = false;
    }, 300);
  }
}


const getNameById = (id) => {
  if (id === userId.value) {
    return userName.value;
  } else {
    console.log("getting name by id", id, contacts.value, selectedChat.value)
    return (selectedChat.value.category === 'group' ? selectedChat.value.id2member : contacts.value)[id].name;
  }
}

const handleGetMoreMessage = () => {
  getHistoryMessage(
      selectedChatId.value,
      selectedChat.value.messages[0] === undefined ? Date.now() : selectedChat.value.messages[0].time,
      selectedChat.value.category === "group" ? 1 : 0,
      20,
  )
}

onMounted(() => {
  if (DEBUG) {
    console.log('contacts value here', contacts.value);
  }
  console.log('in chatpage', contacts.value)
})

</script>

<template>
  <v-row class="mt-auto mb-2 mr-2 d-flex flex-1-1 overflow-y-auto fill-height"
         @click="handleHideProfile($event)"
  >
    <v-col cols="12" sm="4" class="pa-0 fill-height">
      <ChatList v-model="selectedChatId"></ChatList>
    </v-col>
    <v-divider vertical v-if="selectedChat"/>
    <v-col v-if="selectedChat" cols="12" sm="8"
           class="d-flex flex-column flex-1-1 overflow-y-auto fill-height resizable-col"
    >
      <v-row no-gutters class="align-center flex-0-0">
        <v-card class="chat-title ma-1" style="width: 100%" variant="flat">
          <v-toolbar color="#009688">
            <template #prepend>
              <v-avatar size="30" @click="DisplayFriendProfile" v-ripple>
                <v-img :src="selectedChat.avatar" id="friend-avatar" cover/>
              </v-avatar>
            </template>
            <v-toolbar-title>
              <span class="pr-3">{{ selectedChat.username ? selectedChat.username : selectedChat.name }}</span>
              <span v-if="selectedChat.mute"><v-icon size="x-small">mdi-bell-off</v-icon></span>
              <span v-if="selectedChat.block"><v-icon size="x-small">mdi-account-off-outline</v-icon></span>
            </v-toolbar-title>
            <v-btn icon="mdi-account-cog-outline" @click="DisplayFriendProfile"/>
          </v-toolbar>
        </v-card>
      </v-row>
      <v-row no-gutters class="d-flex flex-column pt-3 flex-1-1 overflow-y-auto fill-height">
        <div class="overflow-y-auto flex-1-1 d-flex flex-column" id="message-flow">
          <div>
            <span @click="handleGetMoreMessage" class="text-blue">Get more message...</span>
          </div>
          <MessagePop v-for="(message, index) in selectedChat.messages"
                      :message="message"
                      :final="index === selectedChat.messages.length - 1"
                      :avatar="selectedChat.avatar"
                      :name="getNameById(message.sender)"
                      @finished="ScrollToBottom"
                      @showProfile="DisplayFriendProfile"
          />
        </div>
      </v-row>
      <InputArea :chat="selectedChat"/>
    </v-col>
  </v-row>
  <v-divider vertical v-if="selectedChat"/>
  <div class="profile-area overflow-y-auto" :class="{'profile-area--active': displayProfile}">
    <ContactProfile class="overflow-y-auto" v-if="displayProfile === 'user'" :displayContact="selectedChat"
                   :display="showProfileDetail"/>
    <ContactProfile class="overflow-y-auto" v-if="displayProfile === 'group'" :displayContact="selectedChat"
                   :display="showProfileDetail"/>
  </div>
</template>

<style scoped>

.profile-area {
  width: 0;
  transition-property: width;
  transition-duration: 300ms;
  transition-delay: 0s;
}

.profile-area--active {
  width: 23vw;
}

</style>

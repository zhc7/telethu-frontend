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
    <v-col cols="12" sm="3" class="pa-0 fill-height">
      <ChatList v-model="selectedChatId"></ChatList>
    </v-col>
    <v-divider vertical v-if="selectedChat"/>
    <v-col v-if="selectedChat" cols="12" sm="9"
           class="d-flex flex-column flex-1-1 overflow-y-auto fill-height resizable-col"
    >
      <v-toolbar image="public/pink_background.jpg">
        <v-toolbar-title align="left" class="ml-6">
          <p style="font-size: 20px">{{ selectedChat.username ? selectedChat.username : selectedChat.name }}</p>
          <v-icon size="x-small" v-if="selectedChat.mute">mdi-bell-off</v-icon>
          <v-icon size="x-small" v-if="selectedChat.block">mdi-account-off-outline</v-icon>
        </v-toolbar-title>
        <v-btn icon="mdi-account-cog-outline" @click="DisplayFriendProfile"/>
      </v-toolbar>
      <v-row no-gutters class="d-flex flex-column pt-3 flex-1-1 overflow-y-auto fill-height">
        <div class="overflow-y-auto flex-1-1 d-flex flex-column" id="message-flow" style="max-width: 100%">
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

.title {
  font-size: 22px;
  justify-content: flex-start;
}

</style>

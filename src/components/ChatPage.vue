<script setup>

import ChatList from "./ChatList.vue";
import MessagePop from "./MessagePop.vue";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {contacts, getHistoryMessage, sendMessage} from "../chat.js";
import FriendProfile from "./ContactProfile.vue";
import {DEBUG} from "../constants.js";
import {userId, userName} from "../auth.js";
import Stickers from "./Stickers.vue";

const showProfile = ref(false);
const profile = ref(null);

const onProfileClick = (event) => {
  event.stopPropagation();
};

const onClickOutside = (event) => {
  if (showProfile.value && !profile.value.contains(event.target)) {
    showProfile.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
});

const props = defineProps(["modelValue"])
const emit = defineEmits(['update:modelValue']);
const message = ref("");
const displayProfile = ref(undefined);
const showProfileDetail = ref(false);
const showStickers = ref(false);

const selectedChatId = computed({
  get: () => props.modelValue,
  set: (value) => {
    contacts.value[value].alert = false;
    emit('update:modelValue', value);
  }
});

const selectedChat = computed(() => contacts.value[selectedChatId.value]);

const handleSendMessage = () => {
  if (message.value !== "") {
    sendMessage(+selectedChatId.value, message.value, contacts.value[selectedChatId.value].category === 'group' ? 1 : 0);
    message.value = "";
  }
};

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

const handleTextareaKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};

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
    <v-col v-if="selectedChat" cols="12" :sm="showProfileDetail ? 6 : 9"
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
              <span v-if="selectedChat.mute"><v-icon>mdi-account</v-icon></span>
            </v-toolbar-title>
            <v-btn icon="mdi-account-cog-outline" @click="DisplayFriendProfile"/>
          </v-toolbar>
        </v-card>
      </v-row>
      <v-row no-gutters class="d-flex flex-column pt-3 flex-1-1 overflow-y-auto fill-height">
        <div class="overflow-y-auto flex-1-1 d-flex flex-column overflow-hidden" id="message-flow">
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
      <v-row no-gutters class="d-flex" style="width: 100%">
        <Stickers v-if="showStickers" class="ml-4" @sticker-click="handleSendMessage"/>
      </v-row>
      <v-row no-gutters class="d-flex" style="align-items: center">
        <v-textarea
            rows="1"
            auto-grow
            max-rows="4"
            variant="outlined"
            label="Message here..."
            class="ma-2 ml-4 message-input"
            v-model="message"
            hide-details
            flat
            clearable
            @keydown="handleTextareaKeydown"
            :append-inner-icon="'mdi-emoticon-kiss-outline'"
            @click:append-inner="showStickers = !showStickers"
        ></v-textarea>
        <v-btn class="mt-4 mb-4 mr-4 ml-1" icon="mdi-send" @click="handleSendMessage"/>
      </v-row>
    </v-col>
    <v-col cols="12" sm="3" ref="profile" @click.stop="onProfileClick">
      <FriendProfile class="overflow-y-auto" v-if="displayProfile === 'user'" :displayContact="selectedChat"
                     :display="showProfileDetail">
        <template #btn>
          <v-btn>RECOMMEND</v-btn>
          <v-btn>DELETE</v-btn>
          <v-btn @click="">BLOCK</v-btn>
        </template>
      </FriendProfile>
      <FriendProfile class="overflow-y-auto" v-if="displayProfile === 'group'" :displayContact="selectedChat"
                     :display="showProfileDetail"/>
    </v-col>
  </v-row>

</template>

<style scoped>

.profile-area {
  width: 0;
  transition-property: width;
  transition-duration: 300ms;
  transition-delay: 0s;
}

.profile-area--active {
  width: 25vw;
}

</style>

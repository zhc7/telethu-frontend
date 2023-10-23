<script setup>

import ChatList from "./ChatList.vue";
import MessagePop from "./MessagePop.vue";
import {computed, onMounted, ref} from "vue";
import {contacts, groupMetas, sendMessage} from "../chat.js";
import FriendProfile from "./FriendProfile.vue";
import {DEBUG} from "../constants.js";
import {userId} from "../auth.js";
import Stickers from "./Stickers.vue";

const props = defineProps(["modelValue"])
const emit = defineEmits(['update:modelValue']);
const message = ref("");
const displayProfile = ref(false);
const showProfileDetail = ref(false);
const showStickers = ref(false);

const selectedChatId = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

const selectedChat = computed(() => contacts.value[selectedChatId.value]);

const handleSendMessage = () => {
  if (message.value !== "") {
    sendMessage(selectedChatId.value, message.value);
    message.value = "";
  }
};

const ScrollToBottom = () => {
  const container = document.getElementById('message-flow');
  container.scrollTop = container.scrollHeight;
};

const displayContact = ref();
const DisplayFriendProfile = () => {
  displayProfile.value = displayProfile.value === false;
  window.setTimeout(() => {
    showProfileDetail.value = true;
  }, 300);
  displayContact.value = contacts.value[selectedChatId.value];
};

const handleHideProfile = (event) => {
  const avatar = document.getElementById('friend-avatar');
  if (event.target.parentNode.parentNode.classList.contains('v-avatar')) {
    console.log('is child')
  } else {
    displayProfile.value = false;
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
    <v-col cols="12" sm="4" class="pa-0">
      <ChatList :chat-list="contacts" v-model="selectedChatId"></ChatList>
    </v-col>
    <v-col v-if="selectedChat" cols="12" sm="8"
           class="d-flex flex-column flex-1-1 overflow-y-auto fill-height resizable-col"
    >
      <v-row no-gutters class="align-center flex-0-0">
        <v-card class="chat-title ma-1" style="width: 100%" variant="flat" elevation="6">
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
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
              </template>
              <v-list>
                <v-list-item align="center">
                  <v-btn style="width: 100%" variant="text" @click="">Mute</v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-card>
      </v-row>
      <v-row no-gutters class="d-flex flex-column pt-3 flex-1-1 overflow-y-auto fill-height">
        <div class="overflow-y-auto flex-1-1 d-flex flex-column" id="message-flow">
          <MessagePop v-for="(message, index) in selectedChat.messages"
                      :message="message"
                      :final="index === selectedChat.messages.length - 1"
                      :avatar="selectedChat.type !== 'grp' ?
                      selectedChat.avatar :
                      message.sender !== userId ?
                      groupMetas[selectedChatId].members[message.sender].avatar : undefined"
                      @finished="ScrollToBottom"
                      @showProfile="DisplayFriendProfile"
          />
<!--          <MessagePop :avatar="selectedChat.avatar"-->
<!--                      :message="-->
<!--                      {-->
<!--                         'sender': selectedChat.id,-->
<!--                         'receiver': userId,-->
<!--                         'm_type': 'video',-->
<!--                         'content': '/public/se.mp4',-->
<!--                         'time': Date.now(),-->
<!--                      }"-->
<!--                      @showProfile="DisplayFriendProfile"-->
<!--          />-->
<!--          <MessagePop :avatar="selectedChat.avatar"-->
<!--                      :message="-->
<!--                      {-->
<!--                         'sender': selectedChat.id,-->
<!--                         'receiver': userId,-->
<!--                         'm_type': 'image',-->
<!--                         'content': '/public/baidu.webp',-->
<!--                         'time': Date.now(),-->
<!--                      }"-->
<!--                      @showProfile="DisplayFriendProfile"-->
<!--          />-->

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
  </v-row>
  <div class="profile-area" :class="{'profile-area--active': displayProfile}">
    <FriendProfile v-if="displayProfile" :displayContact="selectedChat" :display="showProfileDetail"/>
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
  width: 25vw;
}

</style>

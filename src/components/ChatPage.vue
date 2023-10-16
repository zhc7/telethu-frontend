<script setup>

import ChatList from "./ChatList.vue";
import MessagePop from "./MessagePop.vue";
import {ref, defineProps, defineEmits} from "vue";
import {fakeContacts} from "../testdata/fakechats.js";

const props = defineProps(['contacts'])

const curChat = ref('');
const selectChat = (newChatId) => {
  props.contacts.forEach((chat) => {
    if (chat.id === newChatId) {
      curChat.value = chat;
    }
  })
};

const ScrollToBottom = () => {
  const container = document.getElementById('message-flow');
  container.scrollTop = container.scrollHeight;
};

</script>

<template>
  <v-row class="mt-auto mb-2 mr-2 d-flex flex-1-1 overflow-y-auto fill-height">
    <v-col cols="12" sm="4" class="pa-0">
      <ChatList :chat-list="contacts" @select="(newChatId) => selectChat(newChatId)"></ChatList>
    </v-col>
    <v-col cols="12" sm="8" class="d-flex flex-column flex-1-1 overflow-y-auto fill-height">
      <v-row class="align-center flex-0-0">
        <v-card class="chat-title ma-1" style="width: 100%" variant="flat" color="#009688">
          <v-card-item>
            <template #prepend>
              <v-avatar size="30">
                <v-img src="/public/download.jpeg"/>
              </v-avatar>
            </template>
            <v-card-title>
              <span class="pr-3">{{ curChat.title }}</span>
              <span v-if="curChat.mute"><v-icon>mdi-account</v-icon></span>
            </v-card-title>
          </v-card-item>
        </v-card>
      </v-row>
      <v-row class="d-flex flex-column pt-3 flex-1-1 overflow-y-auto fill-height">
        <div class="overflow-y-auto flex-1-1" id="message-flow">
          <MessagePop v-for="(message, index) in curChat.messages" :message="message"
                      :final="index === curChat.messages.length - 1"
                      @finished="ScrollToBottom()"
          />
        </div>
      </v-row>
      <v-row class="d-flex" style="align-items: center">
        <v-textarea
            rows="1"
            auto-grow
            variant="outlined"
            label="message"
            class="ma-2 ml-4 message-input"
            color="blue"
            hide-details
            flat
        ></v-textarea>
        <v-btn class="mt-4 mb-4 mr-4 ml-1" icon="mdi-send"/>
      </v-row>
    </v-col>
  </v-row>
</template>

<style scoped>
.chat-list-item {
  position: relative;
}

.chat-time {
  font-size: 0.75em;
  position: absolute;
  right: 1.6em;
  top: 1em;
  color: #888
}

.v-btn:focus {
  outline: none !important;
}

</style>

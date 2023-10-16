<script setup>
import {reactive, ref} from 'vue'
import {fakeContacts} from "../testdata/fakechats.js";
import ChatList from "./ChatList.vue";
import MessagePop from "./MessagePop.vue";
import {FormatChatMessageTime} from "../utils/datetime.js";


const curTab = ref(1);
const contactList = ref(fakeContacts);
const curChat = ref('')

const selectChat = (newChatId) => {
  contactList.value.forEach((chat) => {
    if (chat.id === newChatId) {
      curChat.value = chat;
    }
  })
};
</script>

<template>
  <v-container class="d-flex flex-column pt-0" fluid>
    <v-tabs v-model="curTab" color="deep-purple-accent-4" align-tabs="center" class="nav-section">
      <v-tab :value="1">CHAT</v-tab>
      <v-tab :value="2">CONTACTS</v-tab>
      <v-tab :value="3">SETTINGS</v-tab>
      <v-tab :value="4">PROFILE</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-row class="mt-auto mb-2 fill-height main-section">
      <v-col cols="12" sm="4" class="fill-height chat-list">
        <ChatList :chat-list="contactList" @select="(newChatId) => selectChat(newChatId)"></ChatList>
      </v-col>
      <v-col cols="12" sm="8" class="fill-height d-flex flex-column message-area">
        <v-row class="mt-1 align-center">
          <v-card class="chat-title" style="width: 100%">
            <v-card-item>
              <template #prepend>
                <v-avatar size="30">
                  <img src="../assets/download.jpeg"/>
                </v-avatar>
              </template>
              <v-card-title>
                <span class="pr-3">{{ curChat.title }}</span>
                <span v-if="curChat.mute"><v-icon>mdi-account</v-icon></span>
              </v-card-title>
            </v-card-item>
          </v-card>
          <v-divider></v-divider>

        </v-row>
        <v-row class="fill-height d-flex flex-column pt-3 conversation-area">
          <div>
            <MessagePop v-for="message in curChat.messages" :message="message"/>
          </div>
        </v-row>
        <v-row>
          <v-textarea
            label="Type your message here"
          ></v-textarea>
        </v-row>
        <v-row justify="end" class="ml-4 mr-4 mt-auto mb-0">
          <v-btn color="success" class="mr-2">Send</v-btn>
          <v-btn class="mr-2">clear</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  height: 100vh;
  width: 100%;
}

.main-section {
  overflow: scroll;
}

.chat-list {
  overflow: scroll;
}

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

.conversation-area {
  overflow: scroll;
}

.message-text {
  max-width: 200px;
}

</style>
<script setup>
</script>


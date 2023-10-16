<script setup>
import {ref} from 'vue'
import ChatPage from './ChatPage.vue'
import ContactPage from "./ContactPage.vue";

import {userRef} from "../globals.js";

import {fakeContacts} from "../testdata/fakechats.js";

const contacts = ref(fakeContacts);

const curTab = ref(2);


const activeChat = ref(undefined);
const ActivateChat = (chat) => {
  contacts.value.forEach((contact) => {
    if (contact.id === chat.id) {
      activeChat.value = chat;
    }
  });
  curTab.value = 1;
};

</script>

<template>
  <v-container class="d-flex flex-column pt-0 ma-0" style="max-height: 100vh;">
    <v-tabs v-model="curTab" color="deep-purple-accent-4" align-tabs="center" class="flex-0-0">
      <v-tab :value="1">CHAT</v-tab>
      <v-tab :value="2">CONTACTS</v-tab>
      <v-tab :value="3">SETTINGS</v-tab>
      <v-tab :value="4">PROFILE</v-tab>
    </v-tabs>
    <ChatPage v-if="curTab === 1" :contacts="contacts" :active="activeChat"
    @chat="(chat) => activeChat = chat"/>
    <ContactPage v-if="curTab === 2" :contacts="contacts"
    @chat="(chat) => ActivateChat(chat)"/>
  </v-container>
</template>

<style scoped>
.v-container {
  height: 100vh;
  width: 100%;
  max-width: 100vw;
}

.v-btn:focus {
  outline: none !important;
}

</style>

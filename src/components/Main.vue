<script setup>
import {ref} from 'vue'
import ChatPage from './ChatPage.vue'
import ContactPage from "./ContactPage.vue";

import {userRef} from "../globals.js";

import {fakeContacts} from "../testdata/fakechats.js";

const contacts = ref(fakeContacts);

const curTab = ref(2);

</script>

<template>
  <v-container class="d-flex flex-column pt-0" style="max-height: 100vh;">
    <v-tabs v-model="curTab" color="deep-purple-accent-4" align-tabs="center" class="flex-0-0">
      <v-tab :value="1">CHAT</v-tab>
      <v-tab :value="2">CONTACTS</v-tab>
      <v-tab :value="3">SETTINGS</v-tab>
      <v-tab :value="4">PROFILE</v-tab>
    </v-tabs>
    <v-divider class="d-flex flex-0-0"></v-divider>
    <ChatPage v-if="curTab === 1" :contacts="contacts"/>
    <ContactPage v-if="curTab === 2" :contacts="contacts"/>
  </v-container>
</template>

<style scoped>
.v-container {
  height: 100vh;
  width: 100%;
}


</style>

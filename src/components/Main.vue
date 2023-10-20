<script setup>
import {computed, onMounted, ref} from 'vue'
import ChatPage from './ChatPage.vue'
import ContactPage from "./ContactPage.vue";
import {fakeContacts} from "../testdata/fakechats.js";
import {useRouter} from "vue-router";
import ProfilePage from "./ProfilePage.vue";

const contacts = ref(fakeContacts);
const router = useRouter();
const curTab = ref(1);

const props = defineProps(['page'])
const activePage = computed({
  get: () => {
    console.log("getting " + props.page);
    return props.page;
  },
  set: (value) => {
    console.log("pushing " + value);
    router.replace(value);
  }
});

const activeChat = ref(undefined);
const ActivateChat = (chat) => {
  activeChat.value = chat;
  activePage.value = 'chat';
};
onMounted(() => {
  console.log("page " + activePage.value);
})
</script>

<template>
  <v-container class="d-flex flex-column pt-0 ma-0" style="max-height: 100vh;">
    <v-tabs v-model="activePage" color="deep-purple-accent-4" align-tabs="center" class="flex-0-0">
      <v-tab value="chat">CHAT</v-tab>
      <v-tab value="contacts">CONTACTS</v-tab>
      <v-tab value="settings">SETTINGS</v-tab>
      <v-tab value="profile">PROFILE</v-tab>
    </v-tabs>
    <ChatPage v-if="activePage === 'chat'" v-model="activeChat"/>
    <ContactPage v-if="activePage === 'contacts'" :contacts="contacts"
                 @chat="(chat) => ActivateChat(chat)"/>
    <ProfilePage v-if="activePage === 'profile'"/>
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

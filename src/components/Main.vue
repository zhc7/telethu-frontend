<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import ChatPage from './ChatPage.vue'
import ContactPage from "./ContactPage.vue";
import {useRouter} from "vue-router";
import ProfilePage from "./ProfilePage.vue";
import {isWSConnected, contacts, createSocket} from "../chat.js";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import NavBar from "./NavBar.vue";
import {user, userName} from "../auth.js";
import {activeChatId} from "../globals.js"

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

const ActivateChat = (chat) => {
  activeChatId.value = chat;
  activePage.value = 'chat';
};

watch(activeChatId, (id) => {
  contacts.value[id].unread_counter = 0;
})

onMounted(() => {
  console.log("page " + activePage.value);
  createSocket();
})
</script>

<template>
  <v-container class="d-flex pa-0 ma-0" style="max-height: 100vh">
    <NavBar>
      <List density="compact" nav v-model="activePage" class="overflow-x-hidden">
        <v-list-item class="text-left"
                     :prepend-avatar="user.avatar"
                     :title="userName"
                     @click="activePage = 'profile'"
        >
        </v-list-item>
        <v-divider/>
        <ListItem prepend-icon="mdi-chat" title="Chat" k="chat"></ListItem>
        <ListItem prepend-icon="mdi-account-multiple" title="Contacts" k="contacts"></ListItem>
        <ListItem prepend-icon="mdi-cog" title="Settings" k="settings"></ListItem>
        <ListItem prepend-icon="mdi-account-details" title="Profile" k="profile"></ListItem>
      </List>
      <div class="fix-left-bottom">
        <v-icon title="You are connected" class="text-blue-darken-2" v-if="isWSConnected">mdi-check-decagram</v-icon>
        <v-icon title="reconnecting..." class="mdi-spin text-yellow" v-if="!isWSConnected">mdi-loading</v-icon>
      </div>
    </NavBar>
    <ChatPage v-if="activePage === 'chat'" v-model="activeChatId" />
    <ContactPage v-if="activePage === 'contacts'" @chat="(chat) => ActivateChat(chat)"/>
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

.fix-left-bottom {
  position: absolute;
  bottom: 1em;
  left: 1em;
}
</style>

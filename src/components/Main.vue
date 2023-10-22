<script setup>
import {computed, onMounted, ref} from 'vue'
import ChatPage from './ChatPage.vue'
import ContactPage from "./ContactPage.vue";
import {useRouter} from "vue-router";
import ProfilePage from "./ProfilePage.vue";
import {createSocket, getContacts} from "../chat.js";
import {userId, userName} from "../auth.js";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import NavBar from "./NavBar.vue";

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
  getContacts().then(createSocket);
})
</script>

<template>
  <v-container class="d-flex pa-0 ma-0" style="max-height: 100vh">
    <NavBar>
      <List density="compact" nav v-model="activePage">
        <ListItem
            prepend-avatar="/public/Shenium.png"
            :title="userName"
        />
        <v-divider/>
        <ListItem prepend-icon="mdi-chat" title="Chat" k="chat"></ListItem>
        <ListItem prepend-icon="mdi-account-multiple" title="Contacts" k="contacts"></ListItem>
        <ListItem prepend-icon="mdi-cog" title="Settings" k="settings"></ListItem>
        <ListItem prepend-icon="mdi-account-details" title="Profile" k="profile"></ListItem>
      </List>
    </NavBar>
    <ChatPage v-if="activePage === 'chat'" v-model="activeChat"/>
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

</style>

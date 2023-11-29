<script setup lang="ts">
import {computed, onMounted} from 'vue'
import ChatPage from './ChatPage.vue'
import ContactPage from "./ContactPage.vue";
import {useRouter} from "vue-router";
import ProfilePage from "./ProfilePage.vue";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import NavBar from "./NavBar.vue";
import {activeChatId, currentPage, isSocketConnected, rawRequestList, userAvatar, userName} from "../globals.ts"
import {createSocket} from "../core/socket.ts";
import {getUser} from "../core/data.ts";

const router = useRouter();

const props = defineProps(['page'])
const activePage = computed({
  get: () => {
    console.log("getting " + props.page);
    return props.page;
  },
  set: (value) => {
    currentPage.value = '' + value;
    console.log("pushing " + value);
    router.replace(value);
  }
});

onMounted(() => {
  console.log("page " + activePage.value);
  createSocket();
});

const debugAction = async () => {
  await getUser(162).then((contact) => {
    alert(contact);
  })
}

</script>

<template>
  <v-container class="d-flex pa-0 ma-0" style="max-height: 100vh">
    <NavBar>
      <List density="compact" nav v-model="activePage" class="overflow-x-hidden">
        <v-list-item class="text-left"
                     :prepend-avatar="userAvatar"
                     :title="userName"
                     @click="activePage = 'profile'"
        >
        </v-list-item>
        <v-list-item class="text-left" @click="debugAction">
        </v-list-item>
        <v-divider/>
        <ListItem prepend-icon="mdi-chat" title="Chat" k="chat"></ListItem>
        <ListItem prepend-icon="mdi-account-multiple" :badge-value="rawRequestList.length" title="Contacts" k="contacts"></ListItem>
        <ListItem prepend-icon="mdi-cog" title="Settings" k="settings"></ListItem>
        <ListItem prepend-icon="mdi-account-details" title="Profile" k="profile"></ListItem>
      </List>
      <div class="fix-left-bottom">
        <v-icon title="You are connected" class="text-blue-darken-2" v-if="isSocketConnected">mdi-check-decagram</v-icon>
        <v-icon title="reconnecting..." class="mdi-spin text-yellow" v-if="!isSocketConnected">mdi-loading</v-icon>
      </div>
    </NavBar>
    <ChatPage v-if="activePage === 'chat'" v-model="activeChatId" />
    <ContactPage v-if="activePage === 'contacts'"/>
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

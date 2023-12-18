<script setup lang="ts">
import {computed, onMounted} from 'vue'
import ChatPage from './ChatPage.vue'
import ContactPage from "./ContactPage.vue";
import {useRouter} from "vue-router";
import ProfilePage from "./ProfilePage.vue";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import NavBar from "./NavBar.vue";
import {
  activeChatId,
  colorPickerDialog,
  currentPage, defaultTheme,
  floatingContactId, hotMessages,
  isSocketConnected,
  requests,
  showProfileDialog,
  unreadCounter,
  userAvatar,
  userName
} from "../globals.ts"
import {createSocket} from "../core/socket.ts";
import ContactProfile from "./ContactProfile.vue";
import ColorPicker from "./ColorPicker.vue";
import Purchase from "./Purchase.vue";
import BigImage from "./BigImage.vue";

const router = useRouter();

const props = defineProps(['page'])
const activePage = computed({
  get: () => {
    if (DEBUG) console.log("getting " + props.page);
    return props.page;
  },
  set: (value) => {
    currentPage.value = '' + value;
    if (DEBUG) console.log("pushing " + value);
    router.replace(value);
  }
});

onMounted(() => {
  if (DEBUG) console.log("page " + activePage.value);
  createSocket();
});

const unreadTotal = computed(() => {
  let counter = 0;
  for (const key in unreadCounter.value) {
    counter += unreadCounter.value[key];
  }
  return counter;
});

onMounted(() => {
  if (localStorage.getItem('colors')) {
    const colors = JSON.parse(localStorage.getItem('colors') as string);
    if (colors.color1 && colors.color2 && colors.color3 && colors.color4) {
      document.documentElement.style.setProperty('--picked-color1', colors.color1);
      document.documentElement.style.setProperty('--picked-color2', colors.color2);
      document.documentElement.style.setProperty('--picked-color3', colors.color3);
      document.documentElement.style.setProperty('--picked-color4', colors.color4);
    }
  }
});

import { useTheme } from 'vuetify'
import {DEBUG} from "../constants.ts";
import {killSocket} from "../core/users/send.ts";

const theme = useTheme()

function toggleTheme () {
  defaultTheme.value = theme.global.current.value.dark ? 'light' : 'dark';
  theme.global.name.value = defaultTheme.value;
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
        <v-divider/>
        <v-list-item @click="killSocket">
          寄
        </v-list-item>
        <ListItem prepend-icon="mdi-currency-usd" title="Purchase" k="purchase"></ListItem>
        <ListItem prepend-icon="mdi-chat" title="Chat" :badge-value="unreadTotal" k="chat"></ListItem>
        <ListItem prepend-icon="mdi-account-multiple" :badge-value="requests.length" title="Contacts"
                  k="contacts"></ListItem>
        <ListItem prepend-icon="mdi-cog" title="Settings" k="settings"></ListItem>
        <ListItem prepend-icon="mdi-account-details" title="Profile" k="profile"></ListItem>
      </List>
      <div class="fix-left-bottom">
        <v-icon title="toggle theme" @click="toggleTheme" class="mb-5">mdi-theme-light-dark</v-icon>
        <v-icon title="color picker" @click="colorPickerDialog = true" class="mb-5">mdi-palette</v-icon>
        <v-icon title="You are connected" class="text-blue-darken-2" v-if="isSocketConnected">mdi-check-decagram</v-icon>
        <v-icon title="reconnecting..." class="mdi-spin text-yellow" v-if="!isSocketConnected">mdi-loading</v-icon>
      </div>
    </NavBar>
    <!--ChatPage contains fragments, must manually apply show-->
    <Purchase v-if="activePage === 'purchase'"/>
    <ChatPage :show="activePage === 'chat'" v-model="activeChatId"/>
    <ContactPage v-show="activePage === 'contacts'"/>
    <ProfilePage v-show="activePage === 'profile'"/>
    <v-dialog v-model="showProfileDialog" class="justify-center align-content-center" max-width="25vw">
      <ContactProfile
          :contact-id="floatingContactId"
          class="overflow-y-auto justify-center align-content-center mt-6 mb-6 pt-6 pb-6"
      />
    </v-dialog>
    <BigImage/>
    <ColorPicker v-model="colorPickerDialog" @update:show-dialog="colorPickerDialog = false"/>
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
  display: flex;
  flex-direction: column;
}
</style>

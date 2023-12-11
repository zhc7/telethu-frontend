<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import ChatPage from './ChatPage.vue'
import ContactPage from "./ContactPage.vue";
import {useRouter} from "vue-router";
import ProfilePage from "./ProfilePage.vue";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import NavBar from "./NavBar.vue";
import {
  activeChatId, bigAvatarSource,
  currentPage,
  floatingContactId,
  isSocketConnected,
  requests, showBigAvatar,
  showProfileDialog,
  unreadCounter,
  userAvatar,
  userName
} from "../globals.ts"
import {createSocket} from "../core/socket.ts";
import {getUser} from "../core/data.ts";
import ContactProfile from "./ContactProfile.vue";

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

const debugAction = () => {
  const contact = getUser(162);
  alert(contact);
};

const unreadTotal = computed(() => {
  let counter = 0;
  for (const key in unreadCounter.value) {
    counter += unreadCounter.value[key];
  }
  return counter;
})

const pickingColor1 = ref(null);
const pickingColor2 = ref(null);
const colorPickerDialog = ref(false);
const setColor = () => {
  if (pickingColor1 && pickingColor2) {
    document.documentElement.style.setProperty('--picked-color1', pickingColor1.value);
    document.documentElement.style.setProperty('--picked-color2', pickingColor2.value);
  }
  colorPickerDialog.value = false;
}
const setDefaultColor = () => {
  document.documentElement.style.setProperty('--picked-color1', '#4286f4');
  document.documentElement.style.setProperty('--picked-color2', '#373B44');
  colorPickerDialog.value = false;
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
          <!--          {{ activePage === 'profile' }}-->
        </v-list-item>
        <v-divider/>
        <ListItem prepend-icon="mdi-chat" title="Chat" :badge-value="unreadTotal" k="chat"></ListItem>
        <ListItem prepend-icon="mdi-account-multiple" :badge-value="requests.length" title="Contacts"
                  k="contacts"></ListItem>
        <ListItem prepend-icon="mdi-cog" title="Settings" k="settings"></ListItem>
        <ListItem prepend-icon="mdi-account-details" title="Profile" k="profile"></ListItem>
      </List>
      <div class="fix-left-bottom">
        <v-icon title="color picker" @click="colorPickerDialog = true" class="mb-2">mdi-palette</v-icon>
        <v-icon title="You are connected" class="text-blue-darken-2" v-if="isSocketConnected">mdi-check-decagram</v-icon>
        <v-icon title="reconnecting..." class="mdi-spin text-yellow" v-if="!isSocketConnected">mdi-loading</v-icon>
      </div>
    </NavBar>
    <!--ChatPage contains fragments, must manually apply show-->
    <ChatPage :show="activePage === 'chat'" v-model="activeChatId"/>
    <ContactPage v-show="activePage === 'contacts'"/>
    <ProfilePage v-show="activePage === 'profile'"/>
    <v-dialog v-model="showProfileDialog" class="justify-center align-content-center" max-width="25vw">
      <ContactProfile
          :contact-id="floatingContactId"
          class="overflow-y-auto justify-center align-content-center mt-6 mb-6 pt-6 pb-6"
      />
    </v-dialog>
    <v-dialog v-model="showBigAvatar" class="justify-center align-content-center" max-width="60vh">
      <v-card>
        <v-card-item class="justify-center">
          <v-img
              width="50vh"
              height="50vh"
              :src="bigAvatarSource"
              class="overflow-y-auto justify-center align-content-center mt-6 mb-6 pt-6 pb-6"
              cover="true"
          />
        </v-card-item>
      </v-card>
    </v-dialog>

    <v-dialog v-model="colorPickerDialog" max-width="45vw" max-height="70vh">
      <v-card class="fill-height">
        <v-card-title class="text-center ma-5">
          Pick color for List Item
        </v-card-title>
        <v-row class="justify-center">
          <v-color-picker
              show-swatches
              v-model="pickingColor1"
          ></v-color-picker>
          <span class="mx-4"></span>
          <v-color-picker
              show-swatches
              v-model="pickingColor2"
          ></v-color-picker>
        </v-row>
        <span class="mt-6 text-center" style="color: #888888">Pick two color to make it linear gradient.</span>
        <v-card-actions class="mb-3 mr-4">
          <v-spacer></v-spacer>
          <v-btn color="info" @click="setDefaultColor">default</v-btn>
          <v-btn color="info" @click="setColor">Confirm</v-btn>
          <v-btn color="error" @click="colorPickerDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

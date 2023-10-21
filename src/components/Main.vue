<script setup>
import {computed, onMounted, ref} from 'vue'
import ChatPage from './ChatPage.vue'
import ContactPage from "./ContactPage.vue";
import {useRouter} from "vue-router";
import ProfilePage from "./ProfilePage.vue";
import {createSocket, getContacts} from "../chat.js";
import {userId, userName} from "../auth.js";

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
  <v-container class="d-flex flex-column pt-0 ma-0" style="max-height: 100vh">
    <v-card class="fill-height">
      <v-layout class="fill-height">
        <v-navigation-drawer
            expand-on-hover
            rail
        >
          <v-list>
            <v-list-item
                prepend-avatar="/public/Shenium.png"
                :title="userName"
                :subtitle="'@' + userId"
            ></v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-toilet" title="Chat" @click="activePage = 'chat'"></v-list-item>
            <v-list-item prepend-icon="mdi-toilet" title="Contacts" @click="activePage = 'contacts'"></v-list-item>
            <v-list-item prepend-icon="mdi-paper-roll" title="Settings" @click="activePage = 'settings'"></v-list-item>
            <v-list-item prepend-icon="mdi-paper-roll" title="Profile" @click="activePage = 'profile'"></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="">
          <ChatPage v-if="activePage === 'chat'" v-model="activeChat"/>
          <ContactPage v-if="activePage === 'contacts'" @chat="(chat) => ActivateChat(chat)"/>
          <ProfilePage v-if="activePage === 'profile'"/>
        </v-main>
      </v-layout>
    </v-card>

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

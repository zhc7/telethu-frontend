<script setup>
import {ref, watch} from 'vue'
import {fakeChatList} from "../testdata/fakechats.js";
import ChatList from "./ChatList.vue";


const curTab = ref(1);
const chatList = ref(fakeChatList);
const curChatId = ref('')

watch(curChatId, (newValue) => {

});

</script>

<template>
  <v-container class="d-flex flex-column pt-0" fluid>
    <v-tabs v-model="curTab" color="deep-purple-accent-4" align-tabs="center" class="nav-section">
      <v-tab :value="1">CHAT</v-tab>
      <v-tab :value="2">CONTACTS</v-tab>
      <v-tab :value="3">SETTINGS</v-tab>
      <v-tab :value="4">PROFILE</v-tab>
    </v-tabs>
    <v-row class="bg-blue mt-auto fill-height chat-list">
      <v-col cols="12" sm="4" class="bg-green">
        <ChatList :chat-list="chatList" @select="(chatId) => curChatId = chatId"></ChatList>
      </v-col>
      <v-col cols="12" sm="8" class="bg-purple d-flex flex-column message-area">
        <v-row class="bg-blue mb-auto align-center">
          <v-card class="chat-title" style="width: 100%">
            <v-card-item>
              <template #prepend>
                <v-avatar size="30">
                  <img src="../assets/download.jpeg"/>
                </v-avatar>
              </template>
              <v-card-title>
                <span>{{ curChatId }}</span>
                <span v-if="chat.mute">muted</span>
              </v-card-title>
            </v-card-item>
          </v-card>
        </v-row>
        <v-row class="fill-height bg-white"></v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

.chat-list {
  overflow: scroll;
}

.v-container {
  height: 100vh;
  width: 100%;
}
</style>
<script setup>
</script>
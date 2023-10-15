<script setup>
import {ref} from 'vue'
import {fakeChatList} from "../testdata/fakechats.js";
import ChatList from "./ChatList.vue";
import SentMessage from "./SentMessage.vue";
import ReceivedMessage from "./ReceivedMessage.vue";


const curTab = ref(1);
const chatList = ref(fakeChatList);
const curChat = ref('')

const selectChat = (newChatId) => {
  chatList.value.forEach((chat) => {
    if (chat.id === newChatId) {
      curChat.value = chat;
    }
  })
};
</script>

<template>
  <v-container class="d-flex flex-column pt-0" fluid>
    <v-tabs v-model="curTab" color="deep-purple-accent-4" align-tabs="center" class="nav-section">
      <v-tab :value="1">CHAT</v-tab>
      <v-tab :value="2">CONTACTS</v-tab>
      <v-tab :value="3">SETTINGS</v-tab>
      <v-tab :value="4">PROFILE</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-row class="mt-auto mb-2 fill-height main-section">
      <v-col cols="12" sm="4" class="fill-height chat-list">
        <ChatList :chat-list="chatList" @select="(newChatId) => selectChat(newChatId)"></ChatList>
      </v-col>
      <v-col cols="12" sm="8" class="fill-height d-flex flex-column message-area">
        <v-row class="mt-1 align-center">
          <v-card class="chat-title" style="width: 100%">
            <v-card-item>
              <template #prepend>
                <v-avatar size="30">
                  <img src="../assets/download.jpeg"/>
                </v-avatar>
              </template>
              <v-card-title>
                <span class="pr-3">{{ curChat.id }}</span>
                <span v-if="curChat.mute"><v-icon>mdi-account</v-icon></span>
              </v-card-title>
            </v-card-item>
          </v-card>
          <v-divider></v-divider>

        </v-row>
        <v-row class="fill-height d-flex flex-column conversation-area">
          <div>
            <v-row no-gutters>
              <v-col cols="8" offset="4">
                <v-list>
                  <SentMessage/>
                </v-list>
              </v-col>
            </v-row>
            <!--            <v-row no-gutters>-->
            <!--              <v-col cols="8">-->
            <!--                <v-list >-->
            <!--                  <v-row no-gutters>-->
            <!--                    <ReceivedMessage/>-->
            <!--                  </v-row>-->
            <!--                </v-list>-->
            <!--              </v-col>-->
            <!--            </v-row>-->
          </div>
        </v-row>
        <v-row class="bg-yellow">
          <v-textarea></v-textarea>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  height: 100vh;
  width: 100%;
}

.main-section {
  overflow: scroll;
}

.chat-list {
  overflow: scroll;
}

.conversation-area {
  overflow: scroll;
}

.message-text {
  max-width: 200px;
}

</style>
<script setup>
</script>


<script setup>
import {ref} from "vue";
import {fakeChatList} from "../testdata/fakechats.js";
import NavBar from "./NavBar.vue";
import ChatHeader from "./ChatHeader.vue";
import ChatList from "./ChatList.vue";
import MessageArea from "./MessageArea.vue";
import MessageInputArea from "./MessageInputArea.vue";

const curTab = ref(1);
const chatListHeight = ref("0px");

const chatList = ref(fakeChatList);

const selectedChat = ref(undefined);
const messages = ref([]);

</script>

<template>
  <v-container fluid class="d-flex flex-column">
    <v-row no-gutters align="center" justify="center" class="nav-section pb-2" ref="navSection">
      <NavBar @switch="newValue => {curTab = newValue}"></NavBar>
    </v-row>
    <v-row no-gutters class="fill-height main-section" ref="mainSection">
      <v-col cols="12" sm="4" class="pl-2 pr-2 fill-height">
        <ChatList :chat-list="chatList" @select="curChat"></ChatList>
      </v-col>
      <v-col class="bl-2 br-2 align-content-end">
        <ChatHeader :title="selectedChat" class="mb-auto"></ChatHeader>
        <MessageArea></MessageArea>
        <v-row class="mt-auto message-input-area">
          <MessageInputArea class="align-self-end"></MessageInputArea>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.v-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0.2em;
}

.left-section {
  height: inherit;
  overflow: scroll;
}



.message-input-area {
  overflow: scroll;
}

.v-list-item--active {
  background-color: #8cf;
}
</style>

<script setup>
import {ref} from "vue";
import {fakeChatList} from "../testdata/fakechats.js";
import NavBar from "./NavBar.vue";
import ChatItem from "./ChatItem.vue";
import LogoHeader from "./LogoHeader.vue";
import ChatHeader from "./ChatHeader.vue";
import MessageArea from "./MessageArea.vue";
import MessageTextArea from "./MessageTextArea.vue";

const curTab = ref(1);
const chatList = ref(fakeChatList);

const selectedChat = ref({});
const messages = ref([]);
</script>

<template>
  <v-container fluid>
    <v-row no-gutters align="center" justify="center" class="section">
      <NavBar @switch="newValue => {curTab = newValue}"></NavBar>
    </v-row>
    <v-divider class="border-opacity-50"></v-divider>
    <v-row no-gutters class="main-section">
      <v-col cols="12" sm="4" class="left-section">
        <v-navigation-drawer>
          <v-list-item title="My Application" subtitle="Vuetify"></v-list-item>
          <v-divider></v-divider>
          <v-list-item link title="List Item 1"></v-list-item>
          <v-list-item link title="List Item 2"></v-list-item>
          <v-list-item link title="List Item 3"></v-list-item>
        </v-navigation-drawer>
      </v-col>
      <v-col class="middle-section">
        <ChatHeader :title="'abcd'"></ChatHeader>
        <MessageArea></MessageArea>
        <MessageTextArea></MessageTextArea>
      </v-col>
      <!-- <v-col :cols="2" class="right-section">Right Part</v-col> -->
    </v-row>
    <v-row no-gutters class="spacing-section"></v-row>
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
  padding: 0;
}

.nav-section {
  margin-bottom: 2px;
}

.v-btn {
  font-size: 0.72em !important;
}

.left-section {
  border: 1px solid;
}

.middle-section {
  border: 1px solid;
}

.chat-list {
  max-height: 1000px;
  height: 100vh;
  background-color: #333;
  color: #ddd;
  border-radius: 0;
  border-top: 1px solid;
  border-bottom: 1px solid;
}

.spacing-section {
  height: 10vh;
}
</style>

<script setup>

import ChatList from "./ChatList.vue";
import MessagePop from "./MessagePop.vue";
import {computed, ref} from "vue";
import {contacts, sendMessage} from "../chat.js";
import FriendProfile from "./FriendProfile.vue";

const props = defineProps(["modelValue"])
const emit = defineEmits(['update:modelValue']);
const message = ref("");
const displayContact = ref();

const selectedChatId = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

const selectedChat = computed(() => contacts.value[selectedChatId.value]);

const handleSendMessage = () => {
  sendMessage(selectedChatId.value, message.value);
  message.value = "";
};

const ScrollToBottom = () => {
  const container = document.getElementById('message-flow');
  container.scrollTop = container.scrollHeight;
};


</script>

<template>
  <v-row class="mt-auto mb-2 mr-2 d-flex flex-1-1 fill-height">
    <v-col cols="12" sm="4" class="pa-0">
      <ChatList :chat-list="contacts" v-model="selectedChatId"></ChatList>
    </v-col>
    <v-col v-if="selectedChat" cols="12" sm="8" class="d-flex flex-column flex-1-1 overflow-y-auto fill-height">
      <v-row no-gutters class="align-center flex-0-0">
        <v-card class="chat-title ma-1" style="width: 100%" variant="flat" elevation="6">
          <v-toolbar color="#009688">
            <template #prepend>
              <v-avatar size="30">
                <v-img :src="selectedChat.avatar"/>
              </v-avatar>
            </template>
            <v-toolbar-title>
              <span class="pr-3">{{ selectedChat.username }}</span>
              <span v-if="selectedChat.mute"><v-icon>mdi-account</v-icon></span>
            </v-toolbar-title>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <FriendProfile :displayContact="contacts[selectedChatId]"/>
                </v-list-item>
                <v-list-item align="center">
                  <v-btn style="width: 100%" variant="text" @click="">Mute</v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-card>
      </v-row>
      <v-row no-gutters class="d-flex flex-column pt-3 flex-1-1 overflow-y-auto fill-height">
        <div class="overflow-y-auto flex-1-1 d-flex flex-column" id="message-flow">
          <MessagePop v-for="(message, index) in selectedChat.messages" :message="message"
                      :final="index === selectedChat.messages.length - 1"
                      :avatar="selectedChat.avatar"
                      @finished="ScrollToBottom()"
          />
        </div>
      </v-row>
      <v-row no-gutters class="d-flex" style="align-items: center">
        <v-textarea
            rows="1"
            auto-grow
            max-rows="4"
            variant="outlined"
            label="Message here..."
            class="ma-2 ml-4 message-input"
            v-model="message"
            hide-details
            flat
        ></v-textarea>
        <v-btn class="mt-4 mb-4 mr-4 ml-1" icon="mdi-send" @click="handleSendMessage"/>
      </v-row>
    </v-col>
  </v-row>
</template>

<style scoped>
</style>

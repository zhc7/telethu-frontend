<script setup>
import {computed, onMounted, ref, watch, defineProps} from "vue";
import Stickers from "./Stickers.vue";
import {contacts, sendMessage} from "../chat.js";

const props = defineProps(['chat'])

const message = ref("");
const showStickers = ref(false);

const handleSendMessage = () => {
  if (message.value !== "") {
    console.log("selected chat", contacts.value[props.chat.id]);
    sendMessage(+props.chat.id, message.value, props.chat.category === 'group' ? 1 : 0);
    message.value = "";
  }
};

const handleTextareaKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};
</script>

<template>
  <v-row no-gutters class="d-flex" style="width: 100%">
    <Stickers v-if="showStickers" class="ml-4" @sticker-click="handleSendMessage"/>
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
        clearable
        @keydown="handleTextareaKeydown"
        :append-inner-icon="'mdi-emoticon-kiss-outline'"
        @click:append-inner="showStickers = !showStickers"
    >
      <template #prepend-inner>
        <v-icon @click="">mdi-paperclip</v-icon>
      </template>
    </v-textarea>
    <v-btn class="mt-4 mb-4 mr-4 ml-1" icon="mdi-send" @click="handleSendMessage"/>
  </v-row>
</template>

<style scoped>

</style>
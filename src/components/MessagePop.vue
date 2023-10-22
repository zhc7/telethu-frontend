<script setup>
import {onMounted, ref} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef, userRef} from "../globals.js";
import {userId} from "../auth.js";

const props = defineProps(['message', 'final', 'avatar']);
const emits = defineEmits((['finished', 'showProfile']));

const messagePop = ref();
const messageImg = ref();
const contentHeight = ref('40px');

onMounted(() => {
  if (props.final) {
    emits('finished');
  }
});
</script>

<template>
  <div class="ma-3s justify-center">
    {{ FormatChatMessageTime(nowRef, message.time) }}
  </div>
  <div class="d-flex mt-2" style="max-width: 75%;"
       :style="{alignSelf: message.receiver === userId ? 'flex-start' : 'flex-end'}">
    <v-avatar v-if="userId === message.receiver" class="ml-2 mr-2" @click="$emit('showProfile')">
      <v-img
          :src="avatar"
          alt="John"
          cover
      />
    </v-avatar>
    <div
        v-if="message.m_type === 'text'"
        ref="messagePop"
        class="pa-2 rounded-lg text-left"
        :class="message.receiver === userId ? 'bg-blue' : 'bg-green'"
    >
      <span>{{ message.content }}</span>
    </div>
    <img
        ref="messageImg"
        v-if="message.m_type === 'image'"
        :src="message.content"
        style="max-width: 20vw; min-height: 20vh; border: 4px solid #248aff; border-radius: 10px"
    />
    <v-avatar v-if="userId !== message.receiver" class="ml-2 mr-2">
      <v-img
          :src="userRef.avatar"
          :alt="userRef.title"
      />
    </v-avatar>
  </div>
</template>

<style scoped>
</style>
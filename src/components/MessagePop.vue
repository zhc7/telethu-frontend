<script setup>
import {onMounted, ref} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef, userRef} from "../globals.js";
import {userId} from "../auth.js";

const props = defineProps(['message', 'final', 'avatar', 'name']);
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
       :style="{alignSelf: message.sender !== userId ? 'flex-start' : 'flex-end'}">
    <v-avatar v-if="userId !== message.sender" class="ml-2 mr-2" @click="$emit('showProfile')">
      <v-img
          :src="avatar"
          alt="John"
          cover
      />
    </v-avatar>
    <div class="d-flex flex-column">
      <div class="d-flex">
        <v-spacer v-if="message.sender === userId"/>
        <span class="text-grey mr-1 ml-1" style="font-size: small">
        {{ name }}
      </span>
        <v-spacer v-if="message.sender !== userId"/>
      </div>
      <div
          v-if="message.m_type === 0"
          ref="messagePop"
          class="pa-2 rounded-lg text-left"
          :class="message.sender === userId ? 'bg-green' : 'bg-blue'"
      >
        <span>{{ message.content }}</span>
      </div>
    </div>
    <img
        v-if="message.m_type === 'image'"
        :src="message.content"
        style="max-width: 20vw; max-height: 20vh; border: 4px solid #248aff; border-radius: 10px"
    />
    <video
        v-if="message.m_type === 'video'"
        controls
        :src="message.content"
        style="max-width: 20vw; max-height: 20vh; border: 4px solid #248aff; border-radius: 10px"
    ></video>
    <v-avatar v-if="userId === message.sender" class="ml-2 mr-2">
      <v-img
          :src="userRef.avatar"
          :alt="userRef.title"
      />
    </v-avatar>
  </div>
</template>

<style scoped>
</style>
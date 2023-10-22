<script setup>
import {onMounted, ref} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef, userRef} from "../globals.js";
import {userId} from "../auth.js";

const props = defineProps(['message', 'final', 'avatar']);
const emits = defineEmits((['finished']));

const messagePop = ref();
const contentHeight = ref('40px');

onMounted(() => {
  const height = messagePop.value.offsetHeight;
  contentHeight.value = Math.max(height, 40) + 'px';
  if (props.final) {
    emits('finished');
  }
});
</script>

<template>
  <div class="ma-3s justify-center">
    {{ FormatChatMessageTime(nowRef, message.time) }}
  </div>
  <div class="d-flex mt-2" style="max-width: 75%;" :style="{alignSelf: message.receiver === userId ? 'flex-start' : 'flex-end'}">
    <v-avatar v-if="userId === message.receiver" class="ml-2 mr-2">
      <v-img
          :src="avatar"
          alt="John"
          cover
      />
    </v-avatar>
    <div ref="messagePop" class="pa-2 rounded-lg text-left" :class="message.receiver === userId ? 'bg-blue' : 'bg-green'">
      <span v-if="message.m_type === 'text'">{{ message.content }}</span>
      <v-img
          v-if="message.m_type === 'image'"
          class="align-end text-white"
          height="200"
          width="200"
          :src="message.content"
          cover
      />
    </div>
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
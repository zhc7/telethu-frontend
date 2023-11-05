<script setup>
import {onMounted, ref} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef} from "../globals.js";
import {user, userId} from "../auth.js";

// TODO: display menu when right click on message

const props = defineProps(['message', 'final', 'avatar', 'name']);
const emits = defineEmits((['finished', 'showProfile']));

const messagePop = ref();

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
          :alt="name"
          cover
      />
    </v-avatar>
    <div class="d-flex flex-column flex-1-1 overflow-x-auto">
      <div class="d-flex">
        <v-spacer v-if="message.sender === userId"/>
        <span class="text-grey mr-1 ml-1" style="font-size: small">
          {{ name }}
        </span>
        <v-spacer v-if="message.sender !== userId"/>
      </div>
      <div class="d-flex align-center" style="max-width: 100%">
        <v-icon
            v-if="message.status === 'sending' && message.sender === userId"
            class="mr-3 spin"
        >
          mdi-sync
        </v-icon>
        <v-icon
            v-if="message.status === 'failed' && message.sender === userId"
            class="mr-3 text-red"
        >
          mdi-close-circle-outline
        </v-icon>
        <div
            v-if="message.m_type === 0"
            ref="messagePop"
            class="pa-2 rounded-lg text-left"
            :class="message.sender === userId ? ['bg-green', 'ml-auto'] : ['bg-blue', 'mr-auto']"
            style="white-space: pre-wrap; overflow-wrap: break-word; max-width: 100%"
        >
          {{ message.content }}
        </div>
      </div>
      <div class="d-flex justify-end">
        <v-icon v-show="message.status === 'sent'" size="12px">mdi-check</v-icon>
        <v-icon v-show="message.status === 'read'" size="12px">mdi-check-all</v-icon>
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
          :src="user.avatar"
          :alt="user.name"
          cover
      />
    </v-avatar>
  </div>
</template>

<style scoped>

@keyframes spin {
  100% { transform: rotate(360deg); }
}
.spin {
  animation: spin 1s linear infinite;
}

</style>
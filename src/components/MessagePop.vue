<script setup>
import {onMounted, ref} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef} from "../globals.js";
import {user, userId} from "../auth.js";
import {BASE_API_URL} from "../constants.js";
import {getFileExtension} from "../utils/uploadfiles.js";

// TODO: display menu when right click on message

const props = defineProps(['message', 'final', 'avatar', 'name']);
const emits = defineEmits((['finished', 'showProfile']));

const messagePop = ref();

const previewIconUrl = (extension) => {
  if (extension === "pdf") {
    return 'public/icons/pdf_icon.png';
  } else {
    return 'public/icons/file_icon.png';
  }
}

const getFileInformation = (message) => {
  let parts = message.info.split('|');
  const url = BASE_API_URL + 'files/' + message.content + '/';
  const icon = previewIconUrl(getFileExtension(parts[0]));
  return {
    file_name: parts[0],
    file_size: parts[1],
    file_type: parts[2],
    url: url,
    icon: icon,
  }
}

onMounted(() => {
  if (props.final) {
    emits('finished');
  }
});
</script>

<template>
  <div class="d-flex mt-1"
       :style="{alignSelf: message.sender !== userId ? 'flex-start' : 'flex-end'}"
       :class="message.sender === userId ? 'mr-6':'ml-6'">
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
      <div class="d-flex align-center" style="max-width: 100%" :class="message.sender !== userId ? 'justify-start' : 'justify-end'">
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
            :class="message.sender === userId ? ['bg-green'] : ['bg-blue']"
            style="white-space: pre-wrap; overflow-wrap: break-word; max-width: 100%"
        >
          {{ message.content }}
        </div>
        <img
            v-else-if="message.m_type === 1"
            :src="BASE_API_URL + 'files/' + message.content + '/'"
            style="max-width: 20vw; max-height: 20vh; border: 4px solid #248aff; border-radius: 10px"
        />
        <audio
            v-else-if="message.m_type === 2"
            :src="BASE_API_URL + 'files/' + message.content + '/'"
            style="max-width: 20vw; max-height: 20vh; border: 4px solid #248aff; border-radius: 10px"
        />
        <video
            v-else-if="message.m_type === 3"
            controls
            :src="BASE_API_URL + 'files/' + message.content + '/'"
            style="max-width: 20vw; max-height: 20vh; border: 4px solid #248aff; border-radius: 10px"
        ></video>
        <!--TODO: get file through url when clicked-->
        <v-list-item
            v-else
            ref="messagePop"
            class="pa-2 rounded-lg border"
            :class="message.sender === userId ? ['bg-white'] : ['bg-blue']"
            style="white-space: pre-wrap; overflow-wrap: break-word; max-width: 100%"
        >
          <template #prepend>
            <v-img width="40" :aspect-ratio="1" :src="getFileInformation(message).icon" cover class="rounded ma-1 mr-2"/>
          </template>
          <v-list-item-title style="font-weight: 600; font-size: 16px;">
            {{ getFileInformation(message).file_name }}
          </v-list-item-title>
          <v-list-item-subtitle style="color: #888888">{{ getFileInformation(message).file_size }}</v-list-item-subtitle>
        </v-list-item>
      </div>
      <div class="d-flex" :class="message.sender === userId ? 'justify-end' : ''">
        <v-icon v-if="message.status === 'sent' && message.sender === userId" size="12px">mdi-check</v-icon>
        <v-icon v-else-if="message.status === 'read' && message.sender === userId" size="12px">mdi-check-all</v-icon>
        <v-icon v-else-if="message.sender !== userId" size="12px">mdi-check-all</v-icon>
      </div>
    </div>
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
  100% {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}

</style>
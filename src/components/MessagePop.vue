<script setup>
import {onMounted, ref} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef} from "../globals.js";
import {user, userId} from "../auth.js";
import {BASE_API_URL} from "../constants.js";
import {downloadFile, getFileExtension, triggerDownload} from "../utils/files.js";

// TODO: display menu when right click on message

const props = defineProps(['message', 'final', 'avatar', 'name']);
const emits = defineEmits((['finished', 'showProfile']));

const messagePop = ref();
const blobSrc = ref("");

const previewIconUrl = (extension) => {
  if (extension === "pdf") {
    return 'public/icons/pdf_icon.png';
  } else {
    return 'public/icons/file_icon.png';
  }
}

const getFileInformation = (message) => {
  let parts = message.info.split('/');
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

const download = (retry) => {
  if (retry === 5) return;
  downloadFile(props.message.content).then((url) => {blobSrc.value = url;}).catch((e) => {
    console.log("an error occurred when fetching data", e);
    setTimeout(() => {
      download(retry + 1);
    }, 200 + retry * 500);
  })
}

onMounted(() => {
  if (props.final) {
    emits('finished');
  }
  if(props.message.m_type > 0) download(0);
});
</script>

<template>
  <div class="d-flex mt-1"
       :style="{alignSelf: message.sender !== userId ? 'flex-start' : 'flex-end'}"
       :class="([message.sender === userId ? 'mr-6':'ml-6', message.t_type === 0 ? 'ma-4': ''])">
    <v-avatar v-if="userId !== message.sender" class="ml-2 mr-2" @click="$emit('showProfile')">
      <v-img
          :src="avatar"
          :alt="name"
          cover
      />
    </v-avatar>
    <div class="d-flex flex-column flex-1-1 overflow-x-auto">
      <div class="d-flex" v-if="message.t_type === 1">
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
            :class="message.sender === userId ? ['bubble-right'] : ['bubble-left']"
            style="white-space: pre-wrap; overflow-wrap: break-word; max-width: 100%; margin-bottom: 0; margin-top: 3px"
        >
          {{ message.content }}
        </div>
        <v-img
            v-else-if="message.m_type === 1"
            :src="blobSrc"
            style="max-width: 18vw; max-height: 20vh; min-height: 12vw"
            class="border rounded-lg"
        >
          <template v-slot:error>
            <div class="d-flex justify-center align-center" style="height: 100%; width: 100%;">
              <v-icon size="70px" color="grey">mdi-image-off-outline</v-icon>
            </div>
          </template>
        </v-img>
        <audio
            v-else-if="message.m_type === 2"
            :src="blobSrc"
            style="max-width: 20vw; max-height: 20vh; border: 4px solid #248aff; border-radius: 10px"
        />
        <video
            v-else-if="message.m_type === 3"
            controls
            :src="blobSrc"
            style="max-width: 20vw; max-height: 20vh; border: 1px solid darkgrey; border-radius: 7px"
        ></video>
        <v-list-item
            v-else
            ref="messagePop"
            class="pa-3 rounded-lg border"
            style="white-space: pre-wrap; overflow-wrap: break-word; width: 200px; background-color: rgba(243,243,243,0.5)"
            @click="triggerDownload(message.content, message.info.split('/')[0])"
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
      <div class="d-flex" :class="message.sender === userId ? 'justify-end mr-3' : 'ml-3'">
        <v-icon v-if="message.status === 'sent' && message.sender === userId" size="12px">mdi-check</v-icon>
        <v-icon v-else-if="message.status === 'read' && message.sender === userId" size="12px">mdi-check-all</v-icon>
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


.bubble-left {
  position: relative;
  background: linear-gradient(130deg, #6b72ff 0%, #9c9bf6 100%);
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
  max-width: 40vw !important;
  line-height: 1.4;
  text-align: left;
  margin: 10px;
}

.bubble-left::after {
  content: '';
  position: absolute;
  border-style: solid;
  /* 大小和颜色 */
  border-width: 5px 10px 6px 0;
  border-color: transparent #6b72ff transparent transparent;
  /* 位置 - 箭头将出现在气泡的左侧 */
  left: -8px;
  top: 10px;
}

.bubble-right {
  position: relative;
  background: linear-gradient(130deg, rgba(106, 201, 116, 0.99) 0%, #1db434 100%);
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
  max-width: 40vw !important;
  line-height: 1.4;
  text-align: left;
  margin: 10px;
}

/* 创建向右的箭头 */
.bubble-right::after {
  content: '';
  position: absolute;
  border-style: solid;
  /* 大小和颜色 */
  border-width: 5px 0 5px 10px; /* 调整边框宽度来改变箭头大小 */
  border-color: transparent transparent transparent #29bb3b; /* 右边框颜色为气泡的颜色 */
  /* 位置 - 箭头将出现在气泡的右侧 */
  right: -8px; /* 通过增加或减少数值，调整箭头的确切位置 */
  top: 10px;
}


</style>
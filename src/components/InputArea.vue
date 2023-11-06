<script setup>
import {ref} from "vue";
import Stickers from "./Stickers.vue";
import {contacts, sendFiles, sendMessage} from "../chat.js";
import {getFileType, upLoadFiles} from "../utils/uploadfiles.js";

const props = defineProps(['chat'])

const message = ref("");
const showStickers = ref(false);
const previewFilesDialog = ref(false);

const fileInput = ref(null);
const uploadFiles = ref([]);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handlePreviewFiles = (event) => {
  uploadFiles.value = event.target.files;
  if (!uploadFiles.value.length) return;
  console.log(uploadFiles.value);
  previewFilesDialog.value = true;
};

const handleSendMessage = () => {
  if (message.value !== "") {
    sendMessage(+props.chat.id, message.value, props.chat.category === 'group' ? 1 : 0);
    message.value = "";
  }
};

const loading = ref(false);
const uploadProgress = ref(0);
const handleSendFiles = async () => {
  loading.value = true;
  const t_type = props.chat.category === 'group' ? 1 : 0;
  const uploadPromises = [];

  for (let file of uploadFiles.value) {
    const m_type = getFileType(file.name);
    const md5Promise = sendFiles(+props.chat.id, file, t_type, m_type).then(md5 => {
      return upLoadFiles(file, md5, (progress) => {
        uploadProgress.value = progress;
      });
    });
    uploadPromises.push(md5Promise);
  }

  try {
    await Promise.all(uploadPromises);
    previewFilesDialog.value = false;
  } catch (error) {
    console.error('An error occurred during the upload:', error);
  }
  loading.value = false;
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
        <v-icon @click="triggerFileInput">mdi-paperclip</v-icon>
      </template>
    </v-textarea>
    <input
        type="file"
        ref="fileInput"
        @change="handlePreviewFiles"
        style="display: none;"
        multiple="multiple"
    />
    <v-btn class="mt-4 mb-4 mr-4 ml-1" icon="mdi-send" @click="handleSendMessage"/>
  </v-row>

  <v-dialog v-model="previewFilesDialog" max-width="30vw">
    <v-card>
      <v-progress-linear
          v-if="loading"
          v-model="uploadProgress"
          bottom
          color="deep-purple-accent-4"
      ></v-progress-linear>
      <v-card-title class="text-center">Files Preview</v-card-title>
      <v-card-text class="overflow-y-auto" style="max-height: 30vw;">
        <div v-for="(file, index) in uploadFiles" :key="index">
          <p>{{ file.name }}</p>
          <v-divider v-if="uploadFiles.length > 1 && index !== uploadFiles.length - 1" class="ma-3"/>
        </div>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="previewFilesDialog = false">cancel</v-btn>
        <v-btn color="primary" @click="handleSendFiles">send</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
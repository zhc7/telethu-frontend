<script setup>
import {ref} from "vue";
import Stickers from "./Stickers.vue";
import {sendFiles, sendMessage, sendReadMessage} from "../core/chat.ts";
import {getFileType, uploadFiles, formatFileSize} from "../core/files.ts";
import ListItem from "./ListItem.vue";
import {activeChatId, contacts} from "../globals.ts";

const props = defineProps(['chat'])

const message = ref("");
const showStickers = ref(false);
const previewFilesDialog = ref(false);

const fileInput = ref(null);
const uploadingFiles = ref([]);

const previewIcon = (file) => {
  if (file.type.startsWith('image')) {
    return file.url;
  } else if (file.type.startsWith('video')) {
    return 'icons/video_icon.png';
  } else if (file.type.startsWith('audio')) {
    return 'icons/audio_icon.png';
  } else if (file.type === 'application/pdf') {
    return 'icons/pdf_icon.png';
  } else {
    return 'icons/file_icon.png';
  }
}

const triggerFileInput = () => {
  fileInput.value.click();
};

const processFilesForPreview = (files) => {
  for (let file of files) {
    file.url = URL.createObjectURL(file);
    uploadingFiles.value.push(file);
  }
  if (!uploadingFiles.value.length) return;
  previewFilesDialog.value = true;
};

const handlePreviewFiles = (event) => {
  uploadingFiles.value = [];
  const files = event.target.files;
  processFilesForPreview(files);
  console.log(uploadingFiles.value);
};

const handlePaste = (event) => {
  uploadingFiles.value = [];
  const items = (event.clipboardData).items;
  const filesToPreview = [];
  for (const item of items) {
    if (item.kind === 'file') {
      const file = item.getAsFile();
      filesToPreview.push(file);
    }
  }
  if (filesToPreview.length > 0) {
    processFilesForPreview(filesToPreview);
  }
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

  for (let file of uploadingFiles.value) {
    const m_type = getFileType(file.name);
    const md5Promise = sendFiles(+props.chat.id, file, t_type, m_type).then(md5 => {
      return uploadFiles(file, md5, (progress) => {
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
    message.value = "";
  }
};

const handleFocus = (e) => {
  // read message
  for (let m of contacts.value[activeChatId.value]) {
    sendReadMessage(m.message_id);
  }
}
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
        @focusin="handleFocus"
        :append-inner-icon="'mdi-emoticon-kiss-outline'"
        @click:append-inner="showStickers = !showStickers"
        @paste="handlePaste"
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

  <v-dialog v-model="previewFilesDialog" max-width="400px">
    <v-card>
      <v-progress-linear
          v-if="loading"
          v-model="uploadProgress"
          bottom
          color="deep-purple-accent-4"
      ></v-progress-linear>
      <v-card-title class="text-center">Files Preview</v-card-title>
      <v-card-text style="max-height: 300px; overflow-y: auto;">
        <v-list>
          <v-list-item v-for="(file, index) in uploadingFiles" :key="index">
            <template #prepend>
              <v-img width="60" :aspect-ratio="1" :src="previewIcon(file)" cover class="rounded ma-1 mr-2">
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                        color="grey-lighten-4"
                        indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </template>
            <v-list-item-title style="font-weight: 600; font-size: 16px; margin-bottom: 3px">{{
                file.name
              }}
            </v-list-item-title>
            <v-list-item-subtitle style="color: #888888">{{ formatFileSize(file.size) }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="() => {previewFilesDialog = false; uploadingFiles = []}">cancel</v-btn>
        <v-btn color="primary" @click="handleSendFiles">send</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
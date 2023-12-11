<script setup lang="ts">
import {computed, ref, watch} from "vue";
import Stickers from "./Stickers.vue";
import {formatFileSize, getFileType, uploadFiles} from "../core/files.ts";
import {activeChatId, messages, referencingMessageId, unreadCounter, user, users} from "../globals.ts";
import {readMessage, sendFiles, sendMessage} from "../core/users/send.ts";
import {getUser} from "../core/data.ts";
import {GroupData} from "../utils/structs.ts";
import selectMember from "./SelectMember.vue";
import MessageBrief from "./MessageBrief.vue";


const chat = computed(() => getUser(activeChatId.value));

const message = ref("");
const messageSend = computed(() => {
  return message.value.replace(/@[a-zA-Z0-9_-]+/g, (match, offset) => {
    for (const member of atMembers.value) {
      if (offset >= member.section[0] && offset + match.length - 1 <= member.section[1]) {
        return "@" + member.id.toString();
      }
    }
    return match;
  });
});

const showStickers = ref(false);
const previewFilesDialog = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);
const uploadingFiles = ref<File[]>([]);
const uploadingFilesUrl = ref<{ [key: string]: string }>({}); // {file.name: file.url}

const previewIcon = (file: File) => {
  if (file.type.startsWith('image')) {
    return uploadingFilesUrl.value[file.name];
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
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const processFilesForPreview = (files: FileList | File[]) => {
  for (let file of files) {
    const fileName = file.name;
    if (fileName) {
      uploadingFilesUrl.value[fileName] = URL.createObjectURL(file);
      uploadingFiles.value.push(file);
    }
  }
  if (!uploadingFiles.value.length) return;
  previewFilesDialog.value = true;
};

const handlePreviewFiles = (event: Event) => {
  uploadingFiles.value = [];
  const target = event.target as HTMLInputElement;

  if (target && target.files) {
    const files = target.files;
    processFilesForPreview(files);
    console.log(uploadingFiles.value);
  }
};

const handlePaste = (event: ClipboardEvent) => {
  uploadingFiles.value = [];
  const items = event.clipboardData?.items ?? [];
  const filesToPreview: File[] = [];
  for (const item of items) {
    if (item.kind === 'file') {
      const file = item.getAsFile();
      file && filesToPreview.push(file);
    }
  }
  if (filesToPreview.length > 0) {
    processFilesForPreview(filesToPreview);
  }
};

const handleSendMessage = () => {
  if (message.value !== "") {
    sendMessage(activeChatId.value, messageSend.value, chat.value.category === 'group' ? 1 : 0, atMembers.value.map((i) => i.id));
    message.value = "";
    referencingMessageId.value = -1;
  }
};

watch(activeChatId, () => {
  referencingMessageId.value = -1;
});

const loading = ref(false);
const uploadProgress = ref(0);
const handleSendFiles = async () => {
  loading.value = true;
  const t_type = chat.value.category === 'group' ? 1 : 0;
  const uploadPromises = [];

  for (let file of uploadingFiles.value) {
    const m_type = getFileType(file.name);
    const md5Promise = sendFiles(activeChatId.value, file, t_type, m_type).then(md5 => {
      return uploadFiles(file, md5, (progress: number) => {
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

const composing = ref(false); // handle chinese input

const handleCompositionStart = () => {
  composing.value = true;
};

const handleCompositionEnd = () => {
  composing.value = false;
};

const handleTextareaKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey && !composing.value) {
    e.preventDefault();
    handleSendMessage();
    message.value = "";
  }
  // if cursor is in the section of @, then delete the whole section
  if (e.key === 'Backspace') {
    const cursorPos = (e.target as HTMLTextAreaElement).selectionStart as number;
    for (const member of atMembers.value) {
      if (cursorPos >= member.section[0] && cursorPos <= member.section[1]) {
        atMembers.value = atMembers.value.filter((i) => i.id !== member.id);
        message.value = message.value.slice(0, member.section[0]) + message.value.slice(member.section[1]);
        break;
      }
    }
  }
};

const encounterAt = ref(false);
const selectMemberDialog = ref(false);
const atMembers = ref<{ id: number; section: [number, number]; }[]>([]);
const handleInput = () => {
  const currentMessage = message.value;
  const lastChar = currentMessage.charAt(currentMessage.length - 1);
  if (lastChar === '@') {
    encounterAt.value = true;
    selectMemberDialog.value = true;
  } else {
    encounterAt.value = false;
  }
};

const handleMembersSelected = (selectedMembers: Array<number>) => {
  if (selectedMembers.length === 0) return;
  if (selectedMembers.length > 0) {
    message.value = message.value.slice(0, -1);
  }
  for (const member of selectedMembers) {
    const start = message.value.length;
    message.value += `@${users.value[member].name} `;
    const end = message.value.length;
    atMembers.value.push({id: member, section: [start, end]});
  }
  selectMemberDialog.value = false;
};

const handleFocus = () => {
  // read message
  const chatMessages = messages.value[activeChatId.value];
  unreadCounter.value[activeChatId.value] = 0;
  for (const m of chatMessages) {
    if (m.sender !== user.value.id) {
      readMessage(m.message_id as number);
    }
  }
}
</script>

<template>
  <v-row no-gutters class="d-flex" style="width: 100%">
    <Stickers v-if="showStickers" class="ml-4" @sticker-click="handleSendMessage"/>
  </v-row>
  <v-alert
      v-if="referencingMessageId >= 0"
      border="start"
      variant="tonal"
      style="overflow: visible"
      class="ml-3 mr-3"
      closable
      @close="referencingMessageId = -1"
  >
    <MessageBrief :message-id="referencingMessageId"/>
  </v-alert>
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
        :flat="true"
        :clearable="true"
        @keydown="handleTextareaKeydown"
        @focusin="handleFocus"
        :append-inner-icon="'mdi-emoticon-kiss-outline'"
        @click:append-inner="showStickers = !showStickers"
        @paste="handlePaste"
        @input="handleInput"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
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
        multiple
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

  <selectMember
      v-if="chat.category === 'group'"
      v-model:showDialog="selectMemberDialog"
      :pinned="[]"
      title="Select member to mention"
      :possible="(chat as GroupData).members.filter((id: number) => id !== user.id)"
      @confirm="handleMembersSelected"
  />
</template>

<style scoped>

</style>
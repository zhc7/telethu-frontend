<script setup lang="ts">
import {computed, onMounted, onUpdated, Ref, ref} from "vue";
import {BASE_API_URL, DEBUG} from "../constants.ts";
import {downloadFile, getFileExtension, triggerDownload, uploadFiles} from "../core/files.ts";
import {emojisLoaded, markdown2Html} from "../markdown.ts"
import {bigImageSource, floatingContactId, nowRef, showBigImage, showProfileDialog, user, userId} from "../globals.ts";
import {GroupData, Message, MessageType, TargetType} from "../utils/structs.ts";
import {getUser} from "../core/data.ts";
import Avatar from "./Avatar.vue";
import MessageBrief from "./MessageBrief.vue";
import {formatChatMessageTime} from "../utils/datetime.ts";
import {recognizedText} from "../utils/audio.ts";
import {sendStickerFromHash} from "../utils/stickers.ts";

const props = defineProps<{
  message: Message,
  final: boolean,
  forward: boolean,
}>();
const emits = defineEmits<{
  finished: [],
  showProfile: [id: number],
  showContextMenu: [x: number, y: number, subject: Message],
  showWhoRead: [],
}>();

const messagePop = ref();
const blobSrc = ref("");
const readPercent = computed(() => {
  if (props.message.who_read) {
    if (getUser(props.message.receiver).category !== 'group') {
      return 0;
    }
    return 100 * (props.message.who_read as Array<number>).length / ((getUser(props.message.receiver) as GroupData).members.length - 1);
  } else {
    return 0;
  }
});

const previewIconUrl = (extension: string) => {
  if (extension === "pdf") {
    return 'icons/pdf_icon.png';
  } else {
    return 'icons/file_icon.png';
  }
}

const getFileInformation = (message: Message) => {
  let parts;
  if (typeof message.info !== 'string') {
    parts = ["Unknown", "Unknown", "Unknown"];
  } else {
    parts = (message.info as string).split('/');
  }
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

const download = (retry: number) => {
  if (retry === 2) return;
  if (DEBUG) console.log('filename: ', props.message.content);
  downloadFile(props.message.content as string).then((url) => {
    blobSrc.value = url;
  }).catch(async (e) => {
    if (DEBUG) console.log("an error occurred when fetching data", e);
    if (props.message.m_type === MessageType.STICKER) {
      await sendStickerFromHash(props.message.content as string);
    }
    setTimeout(() => {
      download(retry + 1);
    }, 200 + retry * 500);
  })
}

const openContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  emits('showContextMenu', event.clientX, event.clientY, props.message);
}

onMounted(() => {
  if (props.final) {
    emits('finished');
  }
  if (props.message.m_type > 0) download(0);
});

const container: Ref<HTMLElement | null> = ref(null);

const handleClickImage = () => {
  if (!blobSrc.value) return;
  bigImageSource.value = blobSrc.value;
  showBigImage.value = true;
}

const handleMentionClick = (event: Event) => {
  const userId = (event.target! as HTMLElement).getAttribute('data-user-id');
  if (userId) {
    // 处理点击事件
    if (DEBUG) console.log(`Mention clicked for user ID: ${userId}`);
    showProfileDialog.value = true;
    floatingContactId.value = parseInt(userId);
  }
};

const addMentionEventListeners = () => {
  const element = container.value;
  if (element) {
    const mentions = element.querySelectorAll('.mention');
    mentions.forEach(mention => mention.addEventListener('click', handleMentionClick));
  }
};

onMounted(addMentionEventListeners);
onUpdated(addMentionEventListeners);

if (DEBUG) console.log("message", props.message);
const showRecognizedText = ref(true);
</script>

<template>
  <div class="d-flex pa-1"
       :style="{alignSelf: message.sender !== userId ? 'flex-start' : 'flex-end'}"
       :class="([message.sender === userId ? 'pr-6':'pl-6', message.t_type === 0 ? 'pa-4': ''])">
    <Avatar
        :contact-id="message.sender"
        v-if="userId !== message.sender"
        class="ml-2 mr-2"
        @click="floatingContactId=message.sender; showProfileDialog=true"
    />
    <div class="d-flex flex-column flex-1-1 overflow-x-auto">
      <div class="d-flex" v-if="message.t_type === 1 || forward">
        <v-spacer v-if="message.sender === userId"/>
        <span class="text-grey mr-1 ml-1" style="font-size: small">
          {{ getUser(message.sender).name }}
        </span>
        <v-spacer v-if="message.sender !== userId"/>
      </div>

      <!-- body row -->
      <div class="d-flex align-center" style="max-width: 100%"
           :class="message.sender !== userId ? 'justify-start' : 'justify-end'"
      >
        <v-icon
            v-if="message.pending_status === 'sending' && message.sender === userId"
            class="mr-3 spin"
        >
          mdi-sync
        </v-icon>
        <v-icon
            v-if="message.pending_status === 'failed' && message.sender === userId"
            class="mr-3 text-red"
        >
          mdi-close-circle-outline
        </v-icon>
        <div @contextmenu.stop="openContextMenu">
          <div v-if="message.status && (message.status & 2)">
            <v-list-item style="background-color: #b8c6ea" class="ml-3 mr-3 rounded-lg border">
              <v-list-item-title>
                Recalled Message
              </v-list-item-title>
            </v-list-item>
          </div>
          <div
              v-else-if="message.m_type === MessageType.TEXT && typeof message.content === 'string'"
              ref="messagePop"
              class="pa-2 rounded-lg text-left message-pop"
              :class="message.sender === userId ? ['bubble-right'] : ['bubble-left']"
              style="overflow-wrap: break-word; max-width: 100%; margin-bottom: 0; margin-top: 3px"
          >
            <blockquote v-if="message.info?.reference && message.info.reference >= 0" class="reference">
              <MessageBrief :message-id="message.info.reference as number"/>
            </blockquote>
            <v-divider v-if="message.info?.reference && message.info.reference >= 0" :thickness="3" class="mb-2"/>
            <div ref="container"
                 :key="emojisLoaded.toString()"
                 v-html="markdown2Html(message, getUser(props.message.receiver))"
            />
          </div>
          <div
              v-else-if="message.m_type === MessageType.TEXT && message.content instanceof Array"
          >
            <v-list style="background-color: #DCEDC8" class="ml-3 mr-3 rounded-lg border">
              <v-list-group value="chat history" class="ml-2 mr-2">
                <template v-slot:activator="{ props }">
                  <v-list-item
                      v-bind="props"
                      title="Chat History"
                      prepend-icon="chat_bubble_outline"
                  ></v-list-item>
                </template>

                <MessagePop
                    v-for="msg in message.content.filter(m => m)"
                    :message="msg"
                    :final="false"
                    :forward="true"
                />
              </v-list-group>
            </v-list>
          </div>
          <v-img
              v-else-if="message.m_type === MessageType.IMAGE"
              :src="blobSrc"
              style="max-width: 30vw; max-height: 20vh; min-height: 12vw; min-width: 20vw;"
              class="border rounded-lg"
              @click="handleClickImage"
          >
            <!-- TODO: setting min-width here is inelegant, fix this later -->
            <template v-slot:error>
              <div class="d-flex justify-center align-center" style="height: 100%; width: 100%;">
                <v-icon size="70px" color="grey">mdi-image-off-outline</v-icon>
              </div>
            </template>
          </v-img>
          <audio
              v-else-if="message.m_type === MessageType.AUDIO"
              controls
              :src="blobSrc"
              style="max-width: 50vw;"
          />
          <video
              v-else-if="message.m_type === MessageType.VIDEO"
              controls
              :src="blobSrc"
              style="min-width: 20vw; max-width: 50vw; max-height: 50vh; border: 1px solid darkgrey; border-radius: 7px"
          ></video>
          <v-img
              v-else-if="message.m_type === MessageType.STICKER"
              :src="blobSrc"
              style="width: 100px; height: 100px;"
          ></v-img>
          <v-list-item
              v-else
              ref="messagePop"
              class="pa-3 rounded-lg border"
              style="white-space: pre-wrap; overflow-wrap: break-word; width: 200px; background-color: rgba(243,243,243,0.5)"
              @click="triggerDownload(message.content as string, (message.info as string).split('/')[0])"
          >
            <template #prepend>
              <v-img width="40" :aspect-ratio="1" :src="getFileInformation(message).icon" cover
                     class="rounded ma-1 mr-2"/>
            </template>
            <v-list-item-title style="font-weight: 600; font-size: 16px;">
              {{ getFileInformation(message).file_name }}
            </v-list-item-title>
            <v-list-item-subtitle style="color: #888888">{{
                getFileInformation(message).file_size
              }}
            </v-list-item-subtitle>
          </v-list-item>
        </div>
      </div>

      <!-- bottom icon row -->
      <div
          class="d-flex"
          :class="message.sender === userId ? 'justify-end mr-3' : 'ml-3'"
          v-if="!forward"
      >
        <span
            class="text-grey mr-1" style="font-size: 0.7em; cursor: pointer"
            v-if="message.m_type === MessageType.AUDIO && recognizedText.has(message.message_id as number) && showRecognizedText"
            @click="showRecognizedText = !showRecognizedText"
        >
          {{ recognizedText.get(message.message_id as number) }}
        </span>
        <span
            class="text-grey mr-1" style="font-size: 0.7em"
            :style="recognizedText.has(message.message_id as number)?'cursor: pointer':''"
            v-else-if="message.m_type === MessageType.AUDIO" @click="showRecognizedText = !showRecognizedText"
        >
          {{ message.info.slice(0, -2) }}
        </span>

        <span class=" text-grey mr-1" style="font-size: 0.7em">
        {{ formatChatMessageTime(nowRef, message.time) }}
        </span>
        <v-menu v-if="message.who_reply && message.who_reply.length">
          <template v-slot:activator="{props}">
            <a style="font-size: 0.7em; text-decoration: underline;" v-bind="props">
              {{ message.who_reply.length }} replies
            </a>
          </template>
          <v-list>
            <v-list-item v-for="id in message.who_reply" :key="id">
              <MessageBrief :message-id="id"/>
            </v-list-item>
          </v-list>
        </v-menu>
        <div v-if="message.sender !== userId"/>
        <v-progress-circular
            v-else-if="message.t_type === TargetType.GROUP && readPercent < 100"
            :model-value="readPercent"
            size="10" width="2"
            @click.stop="$emit('showWhoRead')"
            style="cursor: pointer; margin-top: 3px"
        />
        <v-icon v-else-if="message.who_read && (message.who_read as Array<number>).length" size="12px">mdi-check-all
        </v-icon>
        <v-icon v-else-if="typeof message.message_id === 'number'" size="12px">mdi-check</v-icon>
      </div>

      <!-- end message column -->
    </div>

    <Avatar
        @click="floatingContactId=user.id; showProfileDialog=true"
        :contact-id="user.id"
        v-if="user.id === message.sender"
        class="ml-2 mr-2"
    />
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

.reference {
  font-size: 12px;
  color: #dddddd;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
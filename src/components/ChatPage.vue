<script setup lang="ts">

import ChatList from "./ChatList.vue";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import ContactProfile from "./ContactProfile.vue";
import {DEBUG} from "../constants.ts";
import InputArea from "./InputArea.vue";
import {
  activeChatId,
  contacts,
  floatingContactId,
  messages,
  referencingMessageId,
  selectedChatInfo,
  settings,
  showProfileDialog,
  user,
  userContacts,
  users
} from "../globals.ts";
import SelectMember from "./SelectMember.vue";
import {getUser} from "../core/data";
import {ContextMenuSubject, GroupData, Message, TargetType} from "../utils/structs";
import {getHistoryMessage} from "../core/chat.ts";
import MessageContextMenu from "./MessageContextMenu.vue";
import {deleteMessage, forwardMessage, pinMessage, recallMessage, unpinMessage} from "../core/messages/send.ts";
import axios from "axios";
import Avatar from "./Avatar.vue";
import MessageFlow from "./MessageFlow.vue";
import {messageFlow} from "../globals";


const localMessageFlow = ref<InstanceType<typeof MessageFlow> | null>(null);
watch(localMessageFlow, (value) => {
  if (value) {
    messageFlow.value = value;
  }
}, {immediate: true});

defineProps(['modelValue', 'show']);
defineEmits(['update:modelValue']);


const displayProfile = ref<boolean>(false);
const showProfileDetail = ref(false);

const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuSubject = ref<ContextMenuSubject>("blank");

const showWhoReadDialog = ref(false);
const showWhoReadMessage = ref<Message>();
const atMembers = ref<Array<number>>([]);
const showWhoRead = (message: Message) => {
  showWhoReadDialog.value = true;
  showWhoReadMessage.value = message;
  if (message.info instanceof Array) {
    atMembers.value = message.info;
  } else {
    atMembers.value = [];
  }
}

const contextMenuChoices = computed(() => {
  if (contextMenuSubject.value === "blank") {
    return [
      "Select",
    ]
  }
  if (typeof contextMenuSubject.value === 'number') {
    if ((selectedChatInfo.value as GroupData).owner === user.value.id) {
      return ["Unpin"]
    } else {
      return []
    }
  }
  let choices = [
    "Copy",
    "Share",
    "Select",
    "Reference",
    "Translate",
  ]
  if (contextMenuSubject.value.sender === user.value.id) {
    choices.push(
        "Delete",
        "Edit",
        "Withdraw",
    );
  }
  if (category.value === "group" && (selectedChatInfo.value as GroupData).owner === user.value.id) {
    choices.push("Pin");
  }
  return choices;
});

const openContextMenu = (x: number, y: number, subject: ContextMenuSubject) => {
  showContextMenu.value = false;
  nextTick().then(() => {
    contextMenuX.value = x;
    contextMenuY.value = y;
    contextMenuSubject.value = subject;
    showContextMenu.value = true;
  });
}

const closeContextMenu = () => {
  showContextMenu.value = false;
}

const createGroupDialog = ref(false);
const shareMessageDialog = ref(false);
const selected = ref<Array<number>>([]);

watch(activeChatId, (id) => {
  if (id < 1) {
    selectedChatInfo.value = undefined
  }
  selectedChatInfo.value = getUser(id);
}, {immediate: true});

watch(shareMessageDialog, (value) => {
  if (!value) {
    selected.value = [];
  }
});

const displayContact = ref();
const handleDisplayProfile = () => {
  displayProfile.value = true;
  window.setTimeout(() => {
    showProfileDetail.value = true;
  }, 300);
  displayContact.value = users.value[activeChatId.value];
};

const handleClickBlank = () => {
  showWhoReadDialog.value = false;
  displayProfile.value = false;
  showProfileDetail.value = false;
  window.setTimeout(() => {
    showProfileDetail.value = false;
  }, 300);
}

onMounted(() => {
  if (DEBUG) {
    console.log('contacts value here', users.value);
  }
  console.log('in chat page', users.value);
  document.addEventListener("click", closeContextMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeContextMenu);
});

const category = computed(() => {
  if (!selectedChatInfo.value) {
    return 'none';
  }
  return selectedChatInfo.value.category;
});

const title = computed(() => {
  if (!selectedChatInfo.value) {
    return 'Loading...';
  }
  return selectedChatInfo.value.name;
})

const shareMessage = (msg: Message) => {
  if (typeof msg.message_id !== 'number') {
    return;
  }
  selected.value.push(msg.message_id);
  console.log('shared messages: ', selected.value);
  shareMessageDialog.value = true;
  console.log('share', selected.value);
};

const handleShareMessages = (target: Array<number>) => {
  console.log('sharing messages', selected.value);
  let forwardContent;
  if (selectionMode.value) {
    forwardContent = [];
    for (const id of selected.value) {
      forwardContent.push(messages.value[activeChatId.value].find(m => m.message_id === id)!);
    }
  } else {
    forwardContent = messages.value[activeChatId.value].find(m => m.message_id === selected.value[0])!;
  }
  for (const member of target) {
    forwardMessage(forwardContent, member);
  }
  shareMessageDialog.value = false;
  selectionMode.value = false;
}

const selectionMode = ref<boolean>(false);
const selectMessage = (msg: Message) => {
  if (typeof msg.message_id !== 'number') {
    return;
  }
  selected.value.push(msg.message_id);
  selectionMode.value = true;
}

const delMessage = (message: Message) => {
  if (typeof message.message_id !== 'number') {
    return;
  }
  deleteMessage(message.message_id, activeChatId.value, category.value === 'group' ? TargetType.GROUP : TargetType.FRIEND);
};

const withdrawMessage = (message: Message) => {
  if (typeof message.message_id !== 'number') {
    return;
  }
  recallMessage(message.message_id, activeChatId.value, category.value === 'group' ? TargetType.GROUP : TargetType.FRIEND);
};

const pinGroupMessage = (message: Message) => {
  if (typeof message.message_id !== 'number') {
    return;
  }
  pinMessage(message.message_id, activeChatId.value);
};

const translateMessage = async (message: Message) => {
  if (typeof message.content !== 'string') {
    return;
  }
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: message.content,
      source: 'auto',
      target: 'zh',
      format: 'text'
    });
    const translatedText = response.data.translatedText;
    alert(translatedText)
    return translatedText;
  } catch (error) {
    console.error('Error during translation:', error);
  }
}

const handleForwardGroupMessage = () => {
  shareMessageDialog.value = true;
}

const messageItemDispatcher: { [key: string]: (msg: Message) => void } = {
  "Copy": (msg: Message) => {
    navigator.clipboard.writeText(msg.content as string)
  },
  "Share": shareMessage,
  "Select": selectMessage,
  "Reference": (msg: Message) => {
    if (typeof msg.message_id === 'string') return;
    referencingMessageId.value = msg.message_id;
  },
  "Delete": delMessage,
  "Withdraw": withdrawMessage,
  "Pin": pinGroupMessage,
  "Translate": translateMessage,
};

const dispatchFunction = (item: string) => {
  if (contextMenuSubject.value === "blank") {
    selectionMode.value = true;
    return;
  }
  if (typeof contextMenuSubject.value === 'number') {
    if (item === "Unpin") {
      unpinMessage(contextMenuSubject.value, activeChatId.value);
    }
    return;
  }
  messageItemDispatcher[item](contextMenuSubject.value);
}

watch(contacts, async () => {
  for (const id of contacts.value) {
    await getHistoryMessage(id, Date.now(), getUser(id).category === "group" ? TargetType.GROUP : TargetType.FRIEND, 10);
  }
});

const searchingMessage = ref<boolean>(false);
</script>

<template>
  <v-row
      class="mt-auto overflow-y-auto fill-height"
      @click="handleClickBlank"
      style="margin-right: 0; margin-bottom: 0"
      v-show="show"
  >
    <v-col cols="12" :sm="searchingMessage ? 6 : 4" :md="searchingMessage ? 6 : 3" class="pa-0 fill-height changeable-width">
      <ChatList
          v-model="searchingMessage"></ChatList>
    </v-col>
    <v-divider vertical v-if="selectedChatInfo"/>
    <v-col
        cols="12" :sm="searchingMessage ? 6 : 8" :md="searchingMessage ? 6 : 9"
        v-if="activeChatId <= 0"
        class="d-flex flex-column justify-center changeable-width"
    >
      <div class="d-flex justify-center">
        <h4>Select a Friend to Start Chatting</h4>
      </div>
    </v-col>
    <v-col
        v-if="activeChatId !== user.id && activeChatId > 0"
        cols="12" :sm="searchingMessage ? 6 : 8" :md="searchingMessage ? 6 : 9"
        class="d-flex flex-column flex-1-1 overflow-y-auto fill-height resizable-col pa-0 changeable-width"
    >
      <v-toolbar class="megatron" style="width: 100%">
        <v-toolbar-title align="left" class="ml-8">
          <div v-if="selectionMode" class="d-flex">
            <v-btn
                color="blue"
                @click="handleForwardGroupMessage"
            >
              Forward {{ selected.length }}
            </v-btn>
            <v-spacer/>
            <v-btn
                color="red"
                @click="selectionMode=false; selected=[]"
            >
              Cancel
            </v-btn>
          </div>
          <div v-else>
            <p style="font-size: 20px; font-weight: 450; display: inline">
              {{ title }}
            </p>
            <v-icon size="x-small" v-if="selectedChatInfo && settings.muted.includes(selectedChatInfo.id)">
              mdi-bell-off
            </v-icon>
            <v-icon size="x-small" v-if="selectedChatInfo && settings.pinned.includes(selectedChatInfo.id)">
              mdi-pin
            </v-icon>
          </div>
        </v-toolbar-title>
        <v-btn icon="mdi-bug"/>
        <v-btn icon="mdi-plus" @click="createGroupDialog = true;" v-if="category === 'user'"/>
        <v-btn icon="mdi-account-cog-outline" @click.stop="handleDisplayProfile"/>
      </v-toolbar>
      <MessageFlow
          :key="activeChatId"
          ref="localMessageFlow"
          :show-context-menu="showContextMenu"
          :selection-mode="selectionMode"
          v-model:selected="selected"
          @open-context-menu="openContextMenu"
          @show-who-read="showWhoRead"
      />
      <MessageContextMenu
          v-if="showContextMenu"
          :x="contextMenuX"
          :y="contextMenuY"
          :choices="contextMenuChoices"
          @choose="dispatchFunction"
      />
      <InputArea/>
    </v-col>
  </v-row>
  <div
      v-show="show"
      class="profile-area overflow-y-auto"
      :class="{'profile-area--active': displayProfile}"
  >
    <ContactProfile
        class="overflow-y-auto"
        v-if="selectedChatInfo"
        :contact-id="activeChatId"
        @display-profile="(id) => {floatingContactId = id; showProfileDialog = true}"
    >
    </ContactProfile>
  </div>
  <SelectMember
      v-model:show-dialog="createGroupDialog"
      :pinned="category === 'user' ? [user.id, activeChatId] : (selectedChatInfo as GroupData).members"
      :possible="userContacts"
      title="Add member to group"
  />
  <SelectMember
      v-model:show-dialog="shareMessageDialog"
      :pinned="[]"
      title="Share Messages"
      :possible="contacts"
      @confirm="handleShareMessages"
  />
  <v-dialog v-if="category === 'group'" v-model="showWhoReadDialog" width="20vw">
    <v-card>
      <v-card-title class="font-weight-bold text-center">Who Read</v-card-title>
      <v-card-text>
        <fieldset class="title-fieldset">
          <legend class="inner">Read by {{ (showWhoReadMessage?.who_read as number[])?.length ?? 0 }} people</legend>
        </fieldset>
        <v-list>
          <v-list-item v-for="id in showWhoReadMessage?.who_read" :key="id" style="margin-left: 3vw">
            <template #prepend>
              <Avatar :contact-id="id"/>
            </template>
            <v-list-item-title>@{{ getUser(id).name }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <fieldset class="title-fieldset">
          <legend class="inner">Unread by {{
              (selectedChatInfo as GroupData).members.length - 1 - (showWhoReadMessage?.who_read as number[])?.length ?? 0
            }} people
          </legend>
        </fieldset>
        <v-list>
          <v-list-item
              v-for="id in (selectedChatInfo as GroupData).members.filter((_id) =>
              !(showWhoReadMessage?.who_read as number[]).includes(_id) && _id !== user.id)"
              :key="id"
              style="margin-left: 3vw">
            <template #prepend>
              <Avatar :contact-id="id"/>
            </template>
            <v-list-item-title>@{{ getUser(id).name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn @click="showWhoReadDialog = false">close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.message-pop {
  transition: background-color 150ms ease-out;
}

.bg-blue {
  transition: background-color 30ms ease-in;
}

.profile-area {
  width: 0;
  transition-property: width;
  transition-duration: 300ms;
  transition-delay: 0s;
}

.profile-area--active {
  width: 23vw;
}

.v-btn {
  font-size: 15px;
  font-weight: bold;
}

.title-fieldset {
  font-size: 1rem;
  color: red;
  border: none;
  border-top: 1px solid red;
}

.title-fieldset .inner {
  margin: 0 auto;
  padding: 0 0.25rem
}

.changeable-width {
  transition-property: width;
  transition-duration: 0.15s;
  transition-timing-function: ease;
  transition-delay: 0s;
}

</style>

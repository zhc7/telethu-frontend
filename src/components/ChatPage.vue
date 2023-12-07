<script setup lang="ts">

import ChatList from "./ChatList.vue";
import MessagePop from "./MessagePop.vue";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import ContactProfile from "./ContactProfile.vue";
import {DEBUG} from "../constants.ts";
import InputArea from "./InputArea.vue";
import {formatChatMessageTime} from "../utils/datetime.ts";
import {activeChatId, messages, nowRef, selectedChatInfo, settings, user, users} from "../globals.ts";
import SelectMember from "./SelectMember.vue";
import {getUser} from "../core/data";
import {ArrayMenuItems, ContextMenuSubject, Message, MessageMenuItems, TargetType} from "../utils/structs";
import {getHistoryMessage} from "../core/chat.ts";
import MessageContextMenu from "./MessageContextMenu.vue";

const debug = () => {
  console.log('selectMemberSource: ', selectMemberSource.value);
}

defineProps(['modelValue', 'show']);
defineEmits(['update:modelValue']);


const displayProfile = ref<boolean>(false);
const showProfileDetail = ref(false);

const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuSubject = ref<ContextMenuSubject>();

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

const messageSelected = (msg: Message) => {
  if (selectionMode.value) return selected.value.includes(msg);
  if (contextMenuSubject.value?.constructor === Array) {
    return contextMenuSubject.value!.includes(msg);
  } else {
    return showContextMenu.value && contextMenuSubject.value === msg;
  }
}

const selectMemberDialog = ref(false);
const selectMemberSource = ref<string>('contact');
const sharedMessages = ref<Array<Message>>([]);
const selectMemberTitle = ref('Create Group from Contact');

watch(selectMemberSource, () => {
  selectMemberDialog.value = true;
  selectMemberTitle.value = 'Share to Contact';
})

watch(selectMemberDialog, () => {
  if (!selectMemberDialog.value && selectMemberSource.value === 'share') {
    selectMemberSource.value = 'contact';
    sharedMessages.value = [];
  }
})

const groupedMessages = computed(() => {
  const grouped: Array<{
    time: number,
    messages: Array<Message>,
  }> = [];
  let lastTimestamp: null | number = null;
  console.log(messages.value[activeChatId.value]);

  if (messages.value[activeChatId.value] === undefined) {
    return [];
  }

  messages.value[activeChatId.value].forEach((message) => {
    const messageTimestamp = new Date(message.time).getTime();
    if (lastTimestamp == null || messageTimestamp - lastTimestamp >= 180000) {
      grouped.push({
        time: message.time,
        messages: [message],
      });
    } else {
      grouped[grouped.length - 1].messages.push(message);
    }

    lastTimestamp = messageTimestamp;
  });

  return grouped;
});

watch(activeChatId, (id) => {
  if (id < 1) {
    selectedChatInfo.value = undefined
  }
  selectedChatInfo.value = getUser(id);
}, {immediate: true});

const ScrollToBottom = () => {
  const container = document.getElementById('message-flow')!;
  container.scrollTop = container.scrollHeight;
};

const displayContact = ref();
const handleDisplayProfile = () => {
  displayProfile.value = true;
  window.setTimeout(() => {
    showProfileDetail.value = true;
  }, 300);
  displayContact.value = users.value[activeChatId.value];
};

const handleHideProfile = (event: any) => {
  // TODO: complete event type
  const target = event.target.parentNode.parentNode;
  if (target.classList.contains('v-avatar') || target.classList.contains('v-btn')) {
  } else {
    displayProfile.value = false;
    showProfileDetail.value = false;
    window.setTimeout(() => {
      showProfileDetail.value = false;
    }, 300);
  }
}


const handleGetMoreMessage = () => {
  if (selectedChatInfo.value === undefined) {
    return;
  }
  getHistoryMessage(
      activeChatId.value,
      messages.value[activeChatId.value][0] === undefined ? Date.now() : messages.value[activeChatId.value][0].time,
      selectedChatInfo.value.category === "group" ? TargetType.GROUP : TargetType.FRIEND,
      20,
  )
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
  selectMemberSource.value = 'share';
  sharedMessages.value.push(msg);
  console.log('share', sharedMessages.value);
};

const selectionMode = ref<boolean>(false);
const selected = ref<Array<Message>>([]);
const selectMessage = (msg: Message) => {
  selected.value.push(msg);
  selectionMode.value = true;
}

const handleSelectMessage = (msg: Message) => {
  if (selectionMode.value) {
    if (selected.value.includes(msg)) {
      selected.value.splice(selected.value.indexOf(msg), 1);
    } else {
      selected.value.push(msg);
    }
  }
}

const deleteMessage = () => {
  alert('delete');
};

const withdrawMessage = () => {
  alert('withdraw');
};

const shareGroupMessage = (msgs: Array<Message>) => {
  alert("share group message");
}

const handleForwardGroupMessage = () => {
  alert("forwarding " + selected.value.length + " messages");
}

const arrayItemDispatcher: { [key in ArrayMenuItems]: (msgs: Array<Message>) => void } = {
  [ArrayMenuItems.GroupShare]: shareGroupMessage,
};

const messageItemDispatcher: { [key in MessageMenuItems]: (msg: Message) => void } = {
  [MessageMenuItems.Copy]: (msg: Message) => {
    navigator.clipboard.writeText(msg.content as string)
  },
  [MessageMenuItems.Share]: shareMessage,
  [MessageMenuItems.Select]: selectMessage,
  [MessageMenuItems.Delete]: deleteMessage,
  [MessageMenuItems.Withdraw]: withdrawMessage,
};

const dispatchFunction = (item: ArrayMenuItems | MessageMenuItems) => {
  if (contextMenuSubject.value!.constructor === Array) {
    arrayItemDispatcher[item as ArrayMenuItems](contextMenuSubject.value as Array<Message>);
  } else {
    messageItemDispatcher[item as MessageMenuItems](contextMenuSubject.value as Message);
  }
}
</script>

<template>
  <v-row
      class="mt-auto overflow-y-auto fill-height"
      @click="handleHideProfile($event)"
      style="margin-right: 0; margin-bottom: 0"
      v-show="show"
  >
    <v-col cols="12" sm="4" md="3" class="pa-0 fill-height">
      <ChatList v-model="activeChatId"></ChatList>
    </v-col>
    <v-divider vertical v-if="selectedChatInfo"/>
    <v-col v-if="selectedChatInfo?.id !== user.id" cols="12" sm="8" md="9"
           class="d-flex flex-column flex-1-1 overflow-y-auto fill-height resizable-col pa-0"
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
        <v-btn icon="mdi-bug" @click="debug"/>
        <v-btn icon="mdi-plus" @click="selectMemberDialog = true;" v-if="category === 'user'"/>
        <v-btn icon="mdi-account-cog-outline" @click="handleDisplayProfile"/>
      </v-toolbar>
      <v-row no-gutters class="d-flex flex-column flex-1-1 overflow-y-auto fill-height" @contextmenu="">
        <div class="overflow-y-auto flex-1-1 d-flex flex-column" id="message-flow" style="max-width: 100%">
          <div>
            <v-btn @click="handleGetMoreMessage" class="text-blue mt-2" variant="text">Get more message...</v-btn>
          </div>
          <div v-for="(group, index) in groupedMessages" :key="index">
            <div class="justify-center ma-1">
              {{ formatChatMessageTime(nowRef, group.time.toString()) }}
            </div>
            <MessagePop
                v-for="(message, mIndex) in group.messages"
                :key="mIndex"
                :message="message"
                :final="mIndex === group.messages.length - 1"
                :class="{'bg-blue': messageSelected(message)}"
                @finished="ScrollToBottom"
                @show-profile="handleDisplayProfile"
                @show-context-menu="openContextMenu"
                @click="handleSelectMessage(message)"
            />
            <v-scale-transition origin="top left">
              <MessageContextMenu
                  v-if="showContextMenu"
                  :x="contextMenuX"
                  :y="contextMenuY"
                  :type="contextMenuSubject!.constructor === Array ? 'Array' : 'Message'"
                  @choose="dispatchFunction"
              />
            </v-scale-transition>
          </div>
        </div>
      </v-row>
      <InputArea :chat="selectedChatInfo"/>
    </v-col>
  </v-row>
  <div class="profile-area overflow-y-auto" :class="{'profile-area--active': displayProfile}">
    <ContactProfile
        class="overflow-y-auto"
        v-if="selectedChatInfo"
        source="chatPage"
    />
  </div>
  <SelectMember
      v-if="show"
      :showDialog="selectMemberDialog"
      @update:showDialog="selectMemberDialog = $event"
      :source="category === 'user' ? 'personalFriend' : 'existingGroup'"
      :title="selectMemberTitle"
      :sharedMessages="sharedMessages"
  />
</template>

<style scoped>

.profile-area {
  width: 0;
  transition-property: width;
  transition-duration: 300ms;
  transition-delay: 0s;
}

.profile-area--active {
  width: 23vw;
}
</style>

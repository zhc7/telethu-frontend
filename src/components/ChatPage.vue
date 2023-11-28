<script setup lang="ts">

import ChatList from "./ChatList.vue";
import MessagePop from "./MessagePop.vue";
import {computed, onMounted, provide, ref, watch} from "vue";
import ContactProfile from "./ContactProfile.vue";
import {DEBUG} from "../constants.ts";
import InputArea from "./InputArea.vue";
import {formatChatMessageTime} from "../utils/datetime.ts";
import {activeChatId, messages, nowRef, selectedChatInfo, users} from "../globals.ts";
import SelectMember from "./SelectMember.vue";
import {getAvatarOrDefault, getUser} from "../core/data";
import {Message} from "../utils/structs";
import {getHistoryMessage} from "../core/users/send.ts";

const debug = () => {
  console.log('selectMemberSource: ', selectMemberSource.value);
}

defineProps(['modelValue']);
defineEmits(['update:modelValue']);


const displayProfile = ref<boolean>(false);
const showProfileDetail = ref(false);

const selectMemberDialog = ref(false);
const selectMemberSource = ref('contact');
const sharedMessages = ref([]);
provide('selectMemberSource', selectMemberSource);
provide('sharedMessages', sharedMessages);
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
  getUser(id).then((contact) => {
    console.log('selectedChat.value: ', contact);
    selectedChatInfo.value = contact;
  })
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

const handleHideProfile = (event) => {
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
      selectedChatInfo.category === "group" ? 1 : 0,
      20,
  )
}

onMounted(() => {
  if (DEBUG) {
    console.log('contacts value here', users.value);
  }
  console.log('in chatpage', users.value)
})

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

</script>

<template>
  <v-row class="mt-auto d-flex flex-1-1 overflow-y-auto fill-height"
         @click="handleHideProfile($event)"
         style="margin-right: 0; margin-bottom: 0"
  >
    <v-col cols="12" sm="4" md="3" class="pa-0 fill-height">
      <ChatList v-model="activeChatId"></ChatList>
    </v-col>
    <v-divider vertical v-if="selectedChatInfo"/>
    <v-col v-if="selectedChatInfo" cols="12" sm="8" md="9"
           class="d-flex flex-column flex-1-1 overflow-y-auto fill-height resizable-col pa-0"
    >
      <v-toolbar class="megatron" style="width: 100%">
        <v-toolbar-title align="left" class="ml-8">
          <p style="font-size: 20px; font-weight: 450">
            {{ title }}</p>
          <!--          <v-icon size="x-small" v-if="selectedChat.mute">mdi-bell-off</v-icon>-->
          <!--          <v-icon size="x-small" v-if="selectedChat.block">mdi-account-off-outline</v-icon>-->
        </v-toolbar-title>
        <v-btn icon="mdi-bug" @click="debug"/>
        <v-btn icon="mdi-plus" @click="selectMemberDialog = true;" v-if="category === 'user'"/>
        <v-btn icon="mdi-account-cog-outline" @click="handleDisplayProfile"/>
      </v-toolbar>
      <v-row no-gutters class="d-flex flex-column flex-1-1 overflow-y-auto fill-height">
        <div class="overflow-y-auto flex-1-1 d-flex flex-column" id="message-flow" style="max-width: 100%">
          <div>
            <v-btn @click="handleGetMoreMessage" class="text-blue mt-2" variant="text">Get more message...</v-btn>
          </div>
          <div v-for="(group, index) in groupedMessages" :key="index">
            <div class="justify-center ma-1">
              {{ formatChatMessageTime(nowRef, group.time.toString()) }}
            </div>
            <MessagePop v-for="(message, mIndex) in group.messages"
                        :key="mIndex"
                        :message="message"
                        :final="mIndex === group.messages.length - 1"
                        :avatar="getAvatarOrDefault(selectedChatInfo.avatar)"
                        @finished="ScrollToBottom"
                        @showProfile="handleDisplayProfile"
            />
          </div>
        </div>
      </v-row>
      <InputArea :chat="selectedChatInfo"/>
    </v-col>
  </v-row>
  <v-divider vertical v-if="selectedChatInfo"/>
  <div class="profile-area overflow-y-auto" :class="{'profile-area--active': displayProfile}">
    <ContactProfile class="overflow-y-auto"
                    v-if="selectedChatInfo"
                    source="chatPage"
    />
  </div>
  <SelectMember
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

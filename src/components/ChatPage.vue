<script setup lang="ts">

import ChatList from "./ChatList.vue";
import MessagePop from "./MessagePop.vue";
import {computed, onMounted, ref, watch} from "vue";
import {getHistoryMessage} from "../core/chat.ts";
import ContactProfile from "./ContactProfile.vue";
import {DEBUG} from "../constants.ts";
import InputArea from "./InputArea.vue";
import {FormatChatMessageTime} from "../utils/datetime.ts";
import {nowRef, activeChatId, users, userId, userName, messages} from "../globals.ts";
import SelectMember from "./SelectMember.vue";
import {getUser} from "../core/data";
import {ContactsData, Message} from "../utils/structs";

const debug = () => {
  console.log('users', users.value);
  console.log('activeChatId', activeChatId.value);
  console.log('displayContact', selectedChat.value);
}

defineProps(['modelValue']);
defineEmits(['update:modelValue']);


const displayProfile = ref<undefined | "user" | "group">(undefined);
const showProfileDetail = ref(false);
const createGroupDialog = ref(false);

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

    // 检查时间差是否小于一分钟
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

const selectedChat = ref<ContactsData>({avatar: "", category: "", id: 0, name: ""});

watch(activeChatId, (id) => {
  getUser(id).then((contact) => {
    selectedChat.value = contact;
  })
})

const ScrollToBottom = () => {
  const container = document.getElementById('message-flow')!;
  container.scrollTop = container.scrollHeight;
};

const displayContact = ref();
const DisplayFriendProfile = () => {
  displayProfile.value = users.value[activeChatId.value];
  window.setTimeout(() => {
    showProfileDetail.value = true;
  }, 300);
  displayContact.value = users.value[activeChatId.value];
};

const handleHideProfile = (event) => {
  const target = event.target.parentNode.parentNode;
  if (target.classList.contains('v-avatar') || target.classList.contains('v-btn')) {
  } else {
    displayProfile.value = undefined;
    showProfileDetail.value = false;
    window.setTimeout(() => {
      showProfileDetail.value = false;
    }, 300);
  }
}


const getNameById = async (id: number) => {
  if (+id === userId.value) {
    return userName.value;
  } else {
    return (await getUser(id)).name;
  }
}

const handleGetMoreMessage = () => {
  getHistoryMessage(
      activeChatId.value,
      messages.value[activeChatId.value][0] === undefined ? Date.now() : messages.value[activeChatId.value][0].time,
      selectedChat.value.category === "group" ? 1 : 0,
      20,
  )
}

onMounted(() => {
  if (DEBUG) {
    console.log('contacts value here', users.value);
  }
  console.log('in chatpage', users.value)
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
    <v-divider vertical v-if="selectedChat"/>
    <v-col v-if="selectedChat" cols="12" sm="8" md="9"
           class="d-flex flex-column flex-1-1 overflow-y-auto fill-height resizable-col pa-0"
    >
      <v-toolbar class="megatron" style="width: 100%">
        <v-toolbar-title align="left" class="ml-8">
          <p style="font-size: 20px; font-weight: 450">
            {{ selectedChat.name }}</p>
<!--          <v-icon size="x-small" v-if="selectedChat.mute">mdi-bell-off</v-icon>-->
<!--          <v-icon size="x-small" v-if="selectedChat.block">mdi-account-off-outline</v-icon>-->
        </v-toolbar-title>
        <v-btn icon="mdi-bug" @click="debug"/>
        <v-btn icon="mdi-plus" @click="createGroupDialog = true;" v-if="selectedChat.category === 'user'"/>
        <v-btn icon="mdi-account-cog-outline" @click="DisplayFriendProfile"/>
      </v-toolbar>
      <v-row no-gutters class="d-flex flex-column flex-1-1 overflow-y-auto fill-height">
        <div class="overflow-y-auto flex-1-1 d-flex flex-column" id="message-flow" style="max-width: 100%">
          <div>
            <v-btn @click="handleGetMoreMessage" class="text-blue mt-2" variant="text">Get more message...</v-btn>
          </div>
          <div v-for="(group, index) in groupedMessages" :key="index">
            <div class="justify-center ma-1">
              {{ FormatChatMessageTime(nowRef, group.time.toString()) }}
            </div>
            <MessagePop v-for="(message, mIndex) in group.messages"
                        :key="mIndex"
                        :message="message"
                        :final="mIndex === group.messages.length - 1"
                        :avatar="selectedChat.avatar"
                        @finished="ScrollToBottom"
                        @showProfile="DisplayFriendProfile"
            />
          </div>
        </div>
      </v-row>
      <InputArea :chat="selectedChat"/>
    </v-col>
  </v-row>
  <v-divider vertical v-if="selectedChat"/>
  <div class="profile-area overflow-y-auto" :class="{'profile-area--active': displayProfile}">
    <ContactProfile class="overflow-y-auto" v-if="selectedChat" :displayContact="selectedChat"
                    :display="showProfileDetail" source="contactDetail"/>
  </div>

  <SelectMember
      :showDialog="createGroupDialog"
      @update:showDialog="createGroupDialog = $event"
      :type="'create_group_from_contact'"
      :title="'create group from contact'"
      :contactId="activeChatId"
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

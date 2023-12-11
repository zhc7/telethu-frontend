<script setup lang="ts">
import {activeMessages, hotMessages, messages, nowRef, settings, unreadCounter} from "../globals";
import {formatChatMessageTime} from "../utils/datetime";
import {computed} from "vue";
import ListItem from "./ListItem.vue";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";
import {displayHotMessage} from "../utils/notification.ts";
import MessagePop from "./MessagePop.vue";
import {GroupData, Message, MessageType, TargetType, UserData} from "../utils/structs.ts";


const props = defineProps<{
  messageId: string,
}>();


const message = computed(() => {
  for (const msgs of Object.values(messages.value)) {
    for (const msg of msgs) {
      if (msg.message_id === props.messageId) {
        return msg;
      }
    }
  }
  const ph: Message = {
    message_id: 0,
    m_type: 0,
    t_type: 0,
    time: 0,
    content: '',
    sender: 0,
    receiver: 0,
  }
  return ph;
});

const sender = computed(() => {
  return getUser(message.value.sender);
});

const receiver = computed(() => {
  return getUser(message.value.receiver);
})

const bindMessage = (el: InstanceType<typeof MessagePop> | null, id: number | string) => {
  if (typeof id === 'string') {
    return;
  }
  if (el) {
    activeMessages.value[id] = el;
  } else {
    delete activeMessages.value[id];
  }
}

</script>

<template>
  <div class="rounded-lg message-pop-item">
    <ListItem
        :k="message.message_id"
        class="pa-3 pl-6 chat-list-item text-left hot-message"
        rounded="lg"
        :title="sender.name"
        :subtitle="formatChatMessageTime(nowRef, message.time)"
    />
    <MessagePop
        :key="message.message_id"
        :message="message"
        :final="true"
        class="message-pop"
        :ref="(el) => bindMessage(el as InstanceType<typeof MessagePop>, message.message_id)"
        :forward="true"
    />
  </div>
</template>

<style scoped>
.chat-list-item {
  position: relative;
}

.chat-time {
  font-size: 0.75em;
  position: absolute;
  right: 4em;
  top: 2em;
  color: #888
}

.message-pop-item:hover {
  background-color: #ebebeb;
}

</style>
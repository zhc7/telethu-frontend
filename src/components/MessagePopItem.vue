<script setup lang="ts">
import {activeChatId, activeMessages, messages, nowRef, user} from "../globals";
import {formatChatMessageTime} from "../utils/datetime";
import {computed, inject} from "vue";
import ListItem from "./ListItem.vue";
import {getUser} from "../core/data.ts";
import MessagePop from "./MessagePop.vue";
import {Message} from "../utils/structs.ts";

const {selected} = inject<any>("selected");

const props = defineProps<{
  messageId: number,
  active: boolean,
}>();

const active = computed(() => {
  return selected.value === props.messageId;
});

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

const scrollTo = () => {
  setTimeout(() => {
    const el = activeMessages.value[props.messageId];
    el.$el.scrollIntoView({behavior: "smooth", block: "center"});
    el.$el.classList.add("bg-blue");
    setTimeout(() => {
      el.$el.classList.remove("bg-blue");
    }, 700);
  }, 100);
}

</script>

<template>
  <div class="rounded-lg message-pop-item"
       @click="activeChatId = receiver.id === user.id ? sender.id : receiver.id; selected=message.message_id; scrollTo();"
  >
    <ListItem
        :k="message.message_id"
        class="pa-3 pl-6 chat-list-item text-left hot-message"
        rounded="lg"
        :title="sender.name"
        :subtitle="formatChatMessageTime(nowRef, message.time)"
        style="border-radius: 0!important;"
        v-ripple="false"
    />
    <MessagePop
        :class="{'message-pop--active': active, 'dark-ocean': active}"
        :key="message.message_id"
        :message="message"
        :final="true"
        class="message-pop"
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

.message-pop--active {
  color: white !important;
}

</style>
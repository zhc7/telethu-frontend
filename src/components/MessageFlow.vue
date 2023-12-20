<script setup lang="ts">
import {computed, nextTick, reactive, ref, watch} from "vue";
import MessagePop from "./MessagePop.vue";
import {formatChatMessageTime} from "../utils/datetime";
import {
  activeChatId,
  activeMessages,
  floatingContactId,
  messageDict,
  messages,
  nowRef,
  selectedChatInfo,
  showProfileDialog
} from "../globals";
import {ContextMenuSubject, GroupData, Message, MessageType, TargetType} from "../utils/structs";
import {getAsyncMessage} from "../core/messages/receive";
import {DEBUG} from "../constants.ts";
import {getUser} from "../core/data.ts";
import {VInfiniteScroll} from "vuetify/components";
import MessageBanner from "./MessageBanner.vue";
import {activeBlock, activeBlockId, blocks, loadMoreMessage} from "../core/blocks.ts";

const props = defineProps<{
  showContextMenu: boolean,
  selectionMode: boolean,
  selected: Array<number>,
}>();

const emits = defineEmits<{
  openContextMenu: [x: number, y: number, subject: ContextMenuSubject],
  reference: [message: ContextMenuSubject],
  showWhoRead: [message: Message],
  "update:selected": [value: Array<number>],
}>();

const selected = computed({
  get: () => props.selected,
  set: (value) => {
    emits("update:selected", value);
  }
});

const getMessage = (messageId: number | string) => {
  const hit = messageDict.value[messageId];
  if (hit) return hit;
  const existing = messages.value[activeChatId.value].find((msg: Message) => msg.message_id === messageId);
  if (existing) {
    messageDict.value[messageId] = existing;
    return existing;
  }
  const message = reactive<Message>({
    message_id: messageId,
    content: "error",
    m_type: MessageType.TEXT,
    receiver: 0,
    sender: 0,
    t_type: TargetType.OTHER,
    time: 0,
  })
  if (typeof (messageId) === 'string') return message;
  getAsyncMessage(messageId).then((result) => {
    Object.assign(message, result);
  });
  return message;
}

const groupedMessages = computed(() => {
  const grouped: Array<{
    time: number,
    messages: Array<Message>,
  }> = [];
  let lastTimestamp: null | number = null;
  if (DEBUG) console.log(messages.value[activeChatId.value]);

  activeBlock.value.messages.forEach((messageId) => {
    const message = getMessage(messageId);
    if (message === null) {
      if (DEBUG) console.log("null message", messageId);
      return;
    }
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

const localLoadMoreMessage = ({side, done}: { side: any, done: (arg0: any) => void }) => {
  loadMoreMessage(activeChatId.value, activeBlockId.value, side, done);
}

const category = computed(() => {
  return getUser(activeChatId.value).category;
});

const contextMenuSubject = ref<ContextMenuSubject>("blank");


const openBlankContextMenu = (event: MouseEvent) => {
  emits("openContextMenu", event.clientX, event.clientY, "blank");
}

const messageSelected = (msg: Message) => {
  if (typeof msg.message_id !== 'number') {
    return false;
  }
  if (props.selectionMode) return selected.value.includes(msg.message_id);
  return props.showContextMenu && contextMenuSubject.value === msg;
}

const handleSelectMessage = (msg: Message) => {
  if (typeof msg.message_id !== 'number') {
    return;
  }
  if (props.selectionMode) {
    if (selected.value.includes(msg.message_id)) {
      selected.value.splice(selected.value.indexOf(msg.message_id), 1);
    } else {
      selected.value.push(msg.message_id);
    }
  }
}

const openBannerContextMenu = (event: MouseEvent, id: number) => {
  emits("openContextMenu", event.clientX, event.clientY, id);
}

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

const scroll = ref<InstanceType<typeof VInfiniteScroll> | null>(null);

const scrollToBottom = () => {
  if (scroll.value === null) return;
  scroll.value.$el.scrollTop = scroll.value.$el.scrollHeight;
}

const lastMessageId = computed<number | string>(() => {
  const messageList = blocks.value[blocks.value.length - 1].messages;
  if (!messageList.length) {
    return -1;
  }
  return messageList[messageList.length - 1];
});

watch(lastMessageId, (id: number | string) => {
  if (typeof id === 'string') {
    activeBlockId.value = blocks.value.length - 1;
  }
  if (activeBlockId.value === blocks.value.length - 1) {
    nextTick().then(scrollToBottom);
  }
}, {immediate: true});

</script>

<template>
  <MessageBanner
      v-if="category === 'group'"
      v-for="id in (selectedChatInfo as GroupData).top_message"
      :key="id"
      :message-id="id"
      @contextmenu.prevent="openBannerContextMenu($event, id)"
  />
  <v-infinite-scroll
      class="fill-height"
      :side="activeBlockId === blocks.length - 1 ? 'start' : 'both'"
      :key="activeBlock.uid + ' ' + activeChatId"
      ref="scroll"
      @load="localLoadMoreMessage"
      @contextmenu.prevent="openBlankContextMenu"
      @dblclick.prevent="scrollToBottom"
  >
    <div v-for="(group, index) in groupedMessages" :key="index">
      <div class="justify-center ma-1">
        {{ formatChatMessageTime(nowRef, group.time.toString()) }}
      </div>
      <MessagePop
          v-for="(message, mIndex) in group.messages"
          :key="mIndex"
          :message="message"
          :final="mIndex === group.messages.length - 1"
          class="message-pop"
          :class="{'bg-blue': messageSelected(message)}"
          :ref="(el) => bindMessage(el as InstanceType<typeof MessagePop>, message.message_id)"
          @show-profile="(id) => {floatingContactId = id; showProfileDialog = true}"
          @show-context-menu="(x, y, subject) => $emit('openContextMenu', x, y, subject)"
          @dblclick.stop="$emit('reference', message)"
          @click="handleSelectMessage(message)"
          :forward="false"
          @show-who-read="emits('showWhoRead', message)"
      />
    </div>
  </v-infinite-scroll>
</template>

<style scoped>

</style>
<script setup lang="ts">
import {ref, watch} from "vue";
import {getAsyncMessage} from "../core/messages/receive";
import {displayHotMessage} from "../utils/notification";
import {messageFlow} from "../globals";
import {Message} from "../utils/structs";
import {getUser} from "../core/data.ts";

const props = defineProps<{
  messageId: number,
}>();

const content = ref("");
const sender = ref(0);

watch(props, () => {
  getAsyncMessage(props.messageId).then((message: Message) => {
    content.value = displayHotMessage(message);
    sender.value = message.sender;
  })
}, {immediate: true});

const scrollTo = () => {
  messageFlow.value?.jumpTo(props.messageId);
}
</script>

<template>
  <div @click="scrollTo">
    <span class="text-blue-darken-4">{{getUser(sender).name}}:</span>&nbsp;{{ content }}
  </div>
</template>

<style scoped>

</style>
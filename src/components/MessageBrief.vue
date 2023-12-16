<script setup lang="ts">
import {ref, watch} from "vue";
import {getAsyncMessage} from "../core/messages/receive";
import {displayHotMessage} from "../utils/notification";
import {messageFlow} from "../globals";
import {Message} from "../utils/structs";

const props = defineProps<{
  messageId: number,
}>();

const content = ref("");

watch(props, () => {
  getAsyncMessage(props.messageId).then((message: Message) => {
    content.value = displayHotMessage(message);
  })
}, {immediate: true});

const scrollTo = () => {
  messageFlow.value?.jumpTo(props.messageId);
}
</script>

<template>
  <div @click="scrollTo">
    {{ content }}
  </div>
</template>

<style scoped>

</style>
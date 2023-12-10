<script setup lang="ts">
import {ref} from "vue";
import {getMessage} from "../core/messages/receive";
import {displayHotMessage} from "../utils/notification";
import {activeMessages} from "../globals";
import {Message} from "../utils/structs";

const props = defineProps<{
  messageId: number,
}>();

const content = ref("");

getMessage(props.messageId).then((message: Message) => {
  content.value = displayHotMessage(message);
});

const scrollTo = () => {
  const el = activeMessages.value[props.messageId];
  el.$el.scrollIntoView({behavior: "smooth", block: "center"});
  el.$el.classList.add("bg-blue");
  setTimeout(() => {
    el.$el.classList.remove("bg-blue");
  }, 700);
}
</script>

<template>
  <div @click="scrollTo">
    {{ content }}
  </div>
</template>

<style scoped>

</style>
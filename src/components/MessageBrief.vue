<script setup lang="ts">
import {ref} from "vue";
import {getMessage} from "../core/messages/receive";
import {displayHotMessage} from "../utils/notification";

const props = defineProps<{
  messageId: number,
}>();

const content = ref("");

getMessage(props.messageId).then((message) => {
  content.value = displayHotMessage(message);
});
</script>

<template>
  <div>
    {{ content }}
  </div>
</template>

<style scoped>

</style>
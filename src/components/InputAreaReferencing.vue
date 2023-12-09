<script setup lang="ts">
import {ref} from "vue";
import {getMessage} from "../core/messages/receive";
import {displayHotMessage} from "../utils/notification";
import {referencingMessageId} from "../globals";

const content = ref("");

getMessage(referencingMessageId.value).then((message) => {
  content.value = displayHotMessage(message);
});
</script>

<template>
  <v-alert
      border="start"
      variant="tonal"
      style="overflow: visible"
      class="ml-3 mr-3"
      closable
      @close="referencingMessageId = -1"
  >
    {{ content }}
  </v-alert>
</template>

<style scoped>

</style>
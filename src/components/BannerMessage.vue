<script setup lang="ts">
import {ref} from "vue";
import {getMessage} from "../core/messages/receive";
import {displayHotMessage} from "../utils/notification";

const props = defineProps<{
  messageId: number,
}>();

const content = ref("");
const show = ref(true);

getMessage(props.messageId).then((message) => {
  content.value = displayHotMessage(message);
});
</script>

<template>
  <v-banner
      lines="one"
      style="overflow: visible"
      v-show="show"
  >
    <v-banner-text>
      {{ content }}
    </v-banner-text>
    <template v-slot:actions>
      <v-btn @click="show = false">Dismiss</v-btn>
    </template>
  </v-banner>
</template>

<style scoped>

</style>
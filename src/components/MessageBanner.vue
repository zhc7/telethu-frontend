<script setup lang="ts">
import {ref} from "vue";
import MessageBrief from "./MessageBrief.vue";

defineProps<{
  messageId: number,
}>();

const show = ref(true);
</script>

<template>
  <v-banner
      lines="one"
      style="overflow: visible"
      v-show="show"
  >
    <v-banner-text>
      <message-brief :message-id="messageId"/>
    </v-banner-text>
    <template v-slot:actions>
      <v-btn @click="show = false">Dismiss</v-btn>
    </template>
  </v-banner>
</template>

<style scoped>

</style>
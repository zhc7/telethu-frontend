<script setup>
import {ref, watch} from 'vue';
const emit = defineEmits(['switch']);
const tab = ref(1);
watch(tab, (newValue) => {
  emit('switch', newValue);
})
</script>

<template>
  <v-tabs>
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center" class="nav-section">
      <v-tab :value="1">CHAT</v-tab>
      <v-tab :value="2">CONTACTS</v-tab>
      <v-tab :value="3">SETTINGS</v-tab>
      <v-tab :value="4">PROFILE</v-tab>
    </v-tabs>
  </v-tabs>
</template>
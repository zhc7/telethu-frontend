<script setup>

import {ref} from "vue";

const gifs = ref([
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
]);

</script>

<template>
  <v-card
      elevation="2"
      class="pa-3"
      style="width: 100%"
  >
    <div style="max-height: 300px; overflow-y: auto;">
      <!-- This is where your GIF picker interface would go. Below is a simple implementation: -->
      <div v-for="gif in gifs" :key="gif">
        <img :src="gif" alt="gif"/>
      </div>
    </div>
  </v-card>
</template>

<style scoped>

</style>
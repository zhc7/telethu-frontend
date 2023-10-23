<script setup>

import {ref} from "vue";

const stickers = ref([
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
      no-gutters
  >
    <div style="max-height: 300px; overflow-y: auto;">
      <v-row>
        <v-col
            v-for="n in stickers.length"
            :key="n"
            cols="3"
        >
          <img :src="stickers[n]" alt="sticker" class="sticker"/>
        </v-col>
      </v-row>
    </div>
    <v-pagination :length="4"></v-pagination>
  </v-card>
</template>

<style scoped>
.sticker {
  width: 100px;
  height: 100px;
}
</style>
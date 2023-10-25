<script setup>

import {ref} from "vue";

const emit = defineEmits(['sticker-click'])
const emitStickerClick = (stickerData) => {
  emit('emoji-click', stickerData)
}

const stickers = ref([
  "/public/dinosaurs/0.png",
  "/public/dinosaurs/0 (1).png",
  "/public/dinosaurs/0 (2).png",
  "/public/dinosaurs/0 (3).png",
  "/public/dinosaurs/0 (4).png",
  "/public/dinosaurs/0 (5).png",
  "/public/dinosaurs/0 (6).png",
  "/public/dinosaurs/0 (7).png",
  "/public/dinosaurs/0 (8).png",
  "/public/dinosaurs/0 (9).png",
  "/public/dinosaurs/0 (10).png",
  "/public/dinosaurs/0 (11).png",
  "/public/dinosaurs/0 (12).png",
  "/public/dinosaurs/0 (13).png",
  "/public/dinosaurs/0 (14).png",
  "/public/dinosaurs/0 (15).png",
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
          <img :src="stickers[n - 1]" alt="sticker" @click="emitStickerClick(stickers[n - 1])"/>
        </v-col>
      </v-row>
    </div>
    <v-pagination :length="4"></v-pagination>
  </v-card>
</template>

<style scoped>
.sticker {
  width: 50%;
  height: 100%;
}
</style>
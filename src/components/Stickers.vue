<script setup lang="ts">

import {ref} from "vue";
// TODO: complete stickers

const emit = defineEmits(['sticker-click'])
const emitStickerClick = (stickerData: number) => {
  emit('sticker-click', stickerData)
}

const stickers = ref([
  "/public/dinosaurs/1.png",
  "/public/dinosaurs/2.png",
  "/public/dinosaurs/3.png",
  "/public/dinosaurs/4.png",
  "/public/dinosaurs/5.png",
  "/public/dinosaurs/6.png",
  "/public/dinosaurs/7.png",
  "/public/dinosaurs/8.png",
  "/public/dinosaurs/9.png",
  "/public/dinosaurs/10.png",
  "/public/dinosaurs/11.png",
  "/public/dinosaurs/12.png",
  "/public/dinosaurs/13.png",
  "/public/dinosaurs/14.png",
  "/public/dinosaurs/15.png",
  "/public/dinosaurs/16.png",
]);

const dialog = ref(false)
</script>

<template>
  <v-dialog v-model="dialog" max-width="25vw">
    <v-card elevation="2" class="pa-3" no-gutters>
      <v-card-title class="text-h5 text-center">Stickers</v-card-title>
      <v-card-text>
      <v-row>
        <v-col
            v-for="n in stickers.length"
            :key="n"
            cols="3"
            style="padding: 10px;"
        >
          <div class="image-container">
            <v-img :src="stickers[n - 1]" alt="sticker" @click="emitStickerClick(n)" class="sticker-image"
                   :cover="true"/>
          </div>
        </v-col>
      </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style>

.image-container {
  width: 80px;
  height: 80px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sticker-image {
  transition: transform 0.3s;
  transform-origin: center;
}

.sticker-image:hover {
  transform: scale(1.1);
}

</style>

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

</script>

<template>
  <v-card
      elevation="2"
      class="pa-3 sticker-card"
      no-gutters
  >
    <div class="sticker-container">
      <v-row>
        <v-col
            v-for="n in stickers.length"
            :key="n"
            cols="3"
            class="sticker-col"
        >
          <img :src="stickers[n - 1]" alt="sticker" @click="emitStickerClick(n)" class="sticker-image"/>
        </v-col>
      </v-row>
    </div>
    <v-pagination :length="4" class="sticker-pagination"></v-pagination>
  </v-card>
</template>

<style>
.sticker-card {
  background-color: #fff; /* 可以根据需要调整背景颜色 */
  color: #333; /* 文本颜色 */
  max-width: 100%; /* 调整卡片的最大宽度 */
}

.sticker-container {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px; /* 添加内距 */
}

.sticker-col {
  padding: 5px; /* 调整每个贴纸之间的空间 */
}

.sticker-image {
  width: 100%; /* 图片宽度调整为列宽 */
  height: auto; /* 保持图片的纵横比 */
  border-radius: 5px; /* 轻微圆角 */
  cursor: pointer; /* 鼠标悬停时显示手指指针 */
  transition: transform 0.3s; /* 添加过渡效果 */
}

.sticker-image:hover {
  transform: scale(1.1); /* 悬停时轻微放大 */
}

.sticker-pagination {
  padding-top: 10px; /* 分页器顶部内距 */
}
</style>

<script setup lang="ts">

import List from "./List.vue";
import ListItem from "./ListItem.vue";

const props = defineProps(['x', 'y', 'message'])
</script>

<template>
<List class="context-menu" :style="{'top': y + 'px', 'left': x + 'px'}">
  <ListItem
    v-for="item in ['Copy', 'Forward', 'Delete']"
    :key="item"
    :k="item"
  >{{ item }}</ListItem>
</List>
</template>

<style scoped>
.context-menu {
  position: absolute;
  background-color: white;
  z-index: 10000;
}
</style>
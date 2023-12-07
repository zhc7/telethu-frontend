<script setup lang="ts">

import List from "./List.vue";
import ListItem from "./ListItem.vue";

defineProps<{
  x: number,
  y: number,
  choices: Array<string>,
}>();

defineEmits<{
  choose: [item: string],
}>();

</script>

<template>
  <List
      class="context-menu pa-0 rounded-lg"
      :style="{'top': y + 'px', 'left': x + 'px'}"
  >
    <ListItem
        v-for="item in choices"
        :key="item"
        :k="item"
        @click="$emit('choose', item)"
        class="context-menu-item"
        :title="item"
    />
  </List>
</template>

<style scoped>
.context-menu {
  position: absolute;
  background: #C9FFBF; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #FFAFBD, #C9FFBF); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #FFAFBD, #C9FFBF); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  z-index: 10000;
}

.context-menu-item:hover {
  background-color: #eee;
}
</style>
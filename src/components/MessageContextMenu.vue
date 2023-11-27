<script setup lang="ts">

import List from "./List.vue";
import ListItem from "./ListItem.vue";

const props = defineProps(['x', 'y', 'message'])

const menuItems = ['Copy', 'Share', 'Delete', 'Withdraw'];

const shareMessage = () => {
  alert('share');
};

const deleteMessage = () => {
  alert('delete');
};

const withdrawMessage = () => {
  alert('withdraw');
};

const dispatchFunction = (item: string) => {
  if (item === 'Copy') {
    navigator.clipboard.writeText(props.message.content);
  } else if (item === 'Share') {
    shareMessage();
  } else if (item === 'Delete') {
    deleteMessage();
  } else if (item === 'Withdraw') {
    withdrawMessage();
  }
}
</script>

<template>
<List class="context-menu" :style="{'top': y + 'px', 'left': x + 'px'}">
  <ListItem
    v-for="item in menuItems"
    :key="item"
    :k="item"
    @click="dispatchFunction(item)"
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
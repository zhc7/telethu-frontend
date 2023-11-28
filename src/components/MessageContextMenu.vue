<script setup lang="ts">

import List from "./List.vue";
import ListItem from "./ListItem.vue";
import {inject, Ref} from "vue";

const props = defineProps(['x', 'y', 'message'])
const selectMemberSource : Ref<string> = inject('selectMemberSource') as Ref<string>;
const sharedMessages : Ref<Array<number>> = inject('sharedMessages') as Ref<Array<number>>;

const menuItems = ['Copy', 'Share', 'Delete', 'Withdraw'];

const shareMessage = () => {
  selectMemberSource.value = 'share';
  sharedMessages.value.push(props.message);
  console.log('share', sharedMessages.value);
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
        class="context-menu-item"
    >{{ item }}
    </ListItem>
  </List>
</template>

<style scoped>
.context-menu {
  position: absolute;
  background-color: white;
  z-index: 10000;
}
.context-menu-item:hover {
  background-color: #eee;
}
</style>
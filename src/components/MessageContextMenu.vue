<script setup lang="ts">

import List from "./List.vue";
import ListItem from "./ListItem.vue";
import {ArrayMenuItems, MessageMenuItems} from "../utils/structs.ts";

const props = defineProps<{
  x: number,
  y: number,
  type: "Array" | "Message",
}>();

defineEmits<{
  choose: [item: ArrayMenuItems | MessageMenuItems],
}>();

const menuItems = props.type === "Array" ? ArrayMenuItems : MessageMenuItems;

</script>

<template>
  <List class="context-menu" :style="{'top': y + 'px', 'left': x + 'px'}">
    <ListItem
        v-for="item in menuItems"
        :key="item"
        :k="item"
        @click="$emit('choose', item)"
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
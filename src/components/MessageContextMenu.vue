<script setup lang="ts">

import List from "./List.vue";
import ListItem from "./ListItem.vue";
import {nextTick, onMounted, ref} from "vue";
import {DEBUG} from "../constants.ts";

const props = defineProps<{
  x: number,
  y: number,
  choices: Array<string>,
}>();

defineEmits<{
  choose: [item: string],
}>();

const show = ref(false);
const menu = ref<typeof List>();
const x = ref(0);
const y = ref(0);
const xOrient = ref("left");
const yOrient = ref("top");


onMounted(() => {
  show.value = true;
  nextTick().then(() => {
    show.value = false;
    // calculate menu size
    if (DEBUG) console.log(menu.value);
    const menuWidth = menu.value!.$el.clientWidth;
    const menuHeight = menu.value!.$el.clientHeight;
    // calculate x and y
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    if (props.x + menuWidth > windowWidth) {
      x.value = props.x - menuWidth;
      xOrient.value = "right";
    } else {
      x.value = props.x;
    }
    if (props.y + menuHeight > windowHeight) {
      y.value = props.y - menuHeight;
      yOrient.value = "bottom";
    } else {
      y.value = props.y;
    }
    if (DEBUG) console.log(menuHeight, menuWidth, windowHeight, windowWidth, y.value, x.value, props.y, props.x);
    nextTick().then(() => show.value = true);
  })
});

</script>

<template>
  <v-scale-transition :origin="yOrient + ' ' + xOrient">
    <List
        ref="menu"
        class="context-menu pa-0 rounded-lg"
        :style="{'top': y + 'px', 'left': x + 'px'}"
        v-show="show"
    >
      <ListItem
          v-for="item in choices"
          :key="item"
          :k="item"
          @click="$emit('choose', item)"
          class="context-menu-item pt-1 pb-2 pl-1 pr-3 text-grey-darken-3"
          style="font-size: 0.9em; display: inline;"
          :title="item"
          tight
      />
    </List>
  </v-scale-transition>
</template>

<style scoped>
.context-menu {
  position: absolute;
  background: #C9FFBF;
  z-index: 10000;
}

.context-menu-item:hover {
  background-color: #eee;
}
</style>
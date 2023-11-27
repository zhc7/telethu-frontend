<script setup lang="ts">
import {ref, provide} from "vue";

const activated = ref(false);

provide("activated", activated);
</script>

<template>
  <div
      class="mr-2 navbar"
      @mouseover="activated = true"
      @mouseleave="activated = false"
      :class="{'navbar--active': activated}"
  >
    <slot/>
  </div>
</template>

<style scoped>
.navbar {
  width: 64px;
  transition-property: width;
  transition-duration: 0.15s;
  transition-timing-function: ease;
  transition-delay: 0s;
}
.navbar--active {
  width: 150px !important;
}
</style>
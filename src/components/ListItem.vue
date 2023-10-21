<script setup>
import {inject, onMounted} from 'vue'

const props = defineProps(['k'])
const {selected} = inject("selected")

onMounted(() => {
  window.setInterval(() => {
    console.log(selected)
  }, 1000);
})

</script>

<template>
  <v-list-item
      v-bind="$attrs"
      @click="selected = props.k"
      :active="selected === props.k"
      rounded="lg"
      class="pa-3 pl-6"
  >
    <template #prepend>
      <slot name="prepend"/>
    </template>
    <slot/>
  </v-list-item>
</template>

<style scoped>
.v-list-item--active {
  background-color: #248aff !important;
  color: white !important;
}
</style>
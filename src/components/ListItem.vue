<script setup>
import {inject, ref} from 'vue'

const props = defineProps(['k'])
const {selected, updateSelected} = inject("selected")

</script>

<template>
<v-list-item
    v-bind="$attrs"
    @click="updateSelected(props.k)"
    :active="selected === props.k"
    rounded="lg"
    class="pa-3 pl-6"
>
  <slot/>
</v-list-item>
</template>

<style scoped>
.v-list-item.v-list-item--active {
  background-color: #248aff !important;
  color: white !important;
}
</style>
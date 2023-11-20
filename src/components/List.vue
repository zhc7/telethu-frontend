<script setup lang="ts">
import {computed, provide} from "vue";

const props = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

provide("selected", {selected});

</script>

<template>
<v-list v-bind="$attrs">
  <slot/>
</v-list>
</template>

<style scoped>

</style>
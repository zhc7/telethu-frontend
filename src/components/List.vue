<script setup lang="ts">
import {computed, provide} from "vue";

const props = defineProps(["modelValue", "mode"])
const emit = defineEmits(["update:modelValue"])

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

provide("selected", {selected});
provide("mode", {mode: props.mode || "single"});

</script>

<template>
<v-list v-bind="$attrs">
  <slot/>
</v-list>
</template>

<style scoped>

</style>
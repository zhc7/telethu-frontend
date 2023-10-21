<script setup>
import {ref, toRefs, provide, computed} from "vue";

const props = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

provide("selected", {selected})

</script>

<template>
<v-list v-bind="$attrs">
  <slot/>
</v-list>
</template>

<style scoped>

</style>
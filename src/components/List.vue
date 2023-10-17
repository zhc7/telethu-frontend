<script setup>
import {ref, toRefs, provide, computed} from "vue";

const props = defineProps(["modelValue"])
const emit = defineEmits(["update:modelValue"])

const selected = ref(props.modelValue)

const updateSelected = (value) => {
  selected.value = value
  emit("update:modelValue", value)
}

provide("selected", {selected, updateSelected})

</script>

<template>
<v-list v-bind="$attrs">
  <slot/>
</v-list>
</template>

<style scoped>

</style>
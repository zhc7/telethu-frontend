<script setup lang="ts">
import {ref} from "vue";
import SelectMember from "./SelectMember.vue";
import {settings} from "../globals.ts";

defineProps<{
  name: string,
}>();

const dialog = ref<boolean>(false);

</script>

<template>
  <span class="tag pa-2" @click="dialog = true">
    {{ name }}
    <SelectMember
        :title="`Members in ${name}`"
        :possible="settings.tags[name]"
        v-model:show-dialog="dialog"
    ></SelectMember>
  </span>
</template>

<style scoped>

.tag {
  color: grey
}

.tag:hover {
  background-color: #eeeeee;
}

</style>
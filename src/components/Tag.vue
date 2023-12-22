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
  <v-chip class="ma-1" @click="dialog = true" label>
    {{ name }}
    <SelectMember
        :title="`Members in ${name}`"
        :possible="settings.tags[name]"
        v-model:show-dialog="dialog"
    ></SelectMember>
  </v-chip>
</template>

<style scoped>

</style>
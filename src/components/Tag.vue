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
  <v-list-item @click="dialog = true">
    {{ name }}
  </v-list-item>
  <SelectMember
      :possible="settings.tags[name]"
      v-model:show-dialog="dialog"
  ></SelectMember>
</template>
<script setup lang="ts">
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {createNewTag, requests, settings, userContacts, activeTagName} from "../globals.ts";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";
import {computed, ref} from "vue";
import SelectMember from "./SelectMember.vue";
import {callSnackbar} from "../utils/snackbar.ts";

defineProps(["modelValue"]);
defineEmits((["update:modelValue"]))

const tags = computed(() => {
  return Object.keys(settings.value.tags);
});
const newTagDialog = ref<boolean>(false);

const handleNewTag = (target: number [], name: string) => {
  if (name === '') {
    callSnackbar('Cannot use empty name for a tag');
    return;
  }
  createNewTag(name, target);
  newTagDialog.value = false;
}

</script>

<template>

  <List class="fill-height" v-model="activeTagName">
    <v-list-item v-ripple class="new-tag text-center" @click="newTagDialog=true">
      New Tag
    </v-list-item>
    <v-divider class="ma-3"></v-divider>
    <ListItem
        v-for="tag in tags"
        :key="tag"
        :k="tag"
        class="pa-3 pl-6 chat-list-item text-left"
        :title="tag"
    >
      <template #prepend>
        <v-icon>
          mdi-account-multiple
        </v-icon>
      </template>
      <template #append>
<!--        <v-list-item class="v-btn&#45;&#45;density-compact">-->
<!--          <v-btn class="v-btn&#45;&#45;density-comfortable mr-1 bg-green">TODO</v-btn>-->
<!--          <v-btn class="v-btn&#45;&#45;density-comfortable ml-1 bg-red">TODO</v-btn>-->
<!--        </v-list-item>-->
      </template>
    </ListItem>
    <v-list-item class="text-center">
      <span class="text-blue-grey-lighten-2">
        {{ tags.length === 0 ? 'No tags yet' : tags.length === 1 ? '1 tag in total' : tags.length + ' tags in total' }}
      </span>
    </v-list-item>
    <SelectMember
      :possible="userContacts"
      v-model:show-dialog="newTagDialog"
      title="Create a New Tag"
      name
      label="Tag Name"
      @confirm="handleNewTag"
    ></SelectMember>
  </List>
</template>

<style scoped>

.new-tag:hover {
  background-color: #ccc7c7;
}

.new-tag {
  border: 0.4px solid;
}

</style>

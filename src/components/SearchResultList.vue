<script setup lang="ts">
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {activeRequestId, activeSearchId, contactPageProfileSource, requests, searchResults} from "../globals.ts";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";

defineProps(["modelValue"]);
defineEmits((["update:modelValue"]));

</script>

<template>
  <List class="fill-height" v-model="activeSearchId">
    <ListItem
        @click="contactPageProfileSource = 'searchResult'"
        v-for="result in searchResults"
        :key="result.id"
        :k="result.id"
        class="pa-3 pl-6 chat-list-item text-left"
        :title="result.name"
        :subtitle="'@' + result.id"
    >
      <template #prepend>
        <Avatar :contact-id="result.id"/>
      </template>
    </ListItem>
    <v-list-item>
      <span class="text-blue-grey-lighten-2">
        {{ searchResults.length === 0 ? 'No entries' : searchResults.length === 1 ? '1 entry in total' : searchResults.length + ' entries in total' }}
      </span>
    </v-list-item>
  </List>
</template>

<style scoped>
</style>

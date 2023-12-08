<script setup lang="ts">
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {activeRequestId, requests} from "../globals.ts";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";

defineProps(["modelValue"]);
defineEmits((["update:modelValue", 'accept', 'reject']))

</script>

<template>
  <List class="fill-height" v-model="activeRequestId">
    <ListItem
        v-for="request in requests"
        :key="request"
        :k="request"
        class="pa-3 pl-6 chat-list-item text-left"
        :title="getUser(request).name"
        :subtitle="'@' + request"
    >
      <template #prepend>
        <Avatar :contact-id="request"/>
      </template>
      <template #append>
        <v-list-item class="v-btn--density-compact">
          <v-btn class="v-btn--density-comfortable mr-1 bg-green" @click="$emit('accept', request)">PASS</v-btn>
          <v-btn class="v-btn--density-comfortable ml-1 bg-red" @click="$emit('reject', request)">REJECT</v-btn>
        </v-list-item>
      </template>
    </ListItem>
    <v-list-item>
      <span class="text-blue-grey-lighten-2">
        {{ requests.length === 0 ? 'No requests' : requests.length === 1 ? '1 request in total' : requests.length + ' requests in total' }}
      </span>
    </v-list-item>
  </List>
</template>

<style scoped>
</style>

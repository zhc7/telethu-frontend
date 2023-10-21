<script setup>
import {computed, defineProps, onMounted, watch} from 'vue';
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {friendRequests} from "../chat.js";

const props = defineProps(["modelValue"]);
const emit = defineEmits((["update:modelValue"]))
const requests = computed(() => {
  return Object.values(friendRequests.value);
});

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

</script>

<template>
  <List class="fill-height" v-model="selected">
    <v-list-item class="bg-purple">
      <template #title>
        Friend Requests
      </template>
    </v-list-item>
    <ListItem :key="request.id"
              :k="request.id"
              class="pa-3 pl-6 chat-list-item text-left"
              v-for="request in requests"
    >
      <template #prepend>
        <v-avatar>
          <v-img src="/public/download.jpeg" contain/>
        </v-avatar>
      </template>
      <v-list-item-title>
        {{ request.username }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ request.username }}
      </v-list-item-subtitle>
      <template #append>
        <v-list-item-action class="justify-end v-btn--density-compact">
          <v-btn class="v-btn--density-comfortable mr-1 bg-green">PASS</v-btn>
          <v-btn class="v-btn--density-comfortable ml-1 bg-red">REJECT</v-btn>
        </v-list-item-action>
      </template>
    </ListItem>
    <v-list-item>
      <span class="text-blue-grey-lighten-2">
        {{ requests.length }} requests in total
      </span>
    </v-list-item>
  </List>
</template>
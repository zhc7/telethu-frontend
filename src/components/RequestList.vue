<script setup>
import {computed, ref} from 'vue';
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {friendRequests} from "../chat.js";

const props = defineProps(["modelValue"]);
const emit = defineEmits((["update:modelValue", 'accept', 'reject']))
const requests = computed(() => {
  return Object.values(friendRequests.value);
});

const showButton = ref(false);


const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});


</script>

<template>
  <List class="fill-height" v-model="selected">
    <ListItem :key="request.id"
              :k="request.id"
              class="pa-3 pl-6 chat-list-item text-left"
              v-for="request in requests"
              :title="request.username"
              :subtitle="'@' + request.id"
    >
      <template #prepend>
        <v-avatar>
          <v-img :src="request.avatar" cover/>
        </v-avatar>
      </template>
      <template #append>
        <v-list-item class="v-btn--density-compact">
          <v-btn class="v-btn--density-comfortable mr-1 bg-green" @click="$emit('accept', request.id)">PASS</v-btn>
          <v-btn class="v-btn--density-comfortable ml-1 bg-red" @click="$emit('reject', request.id)">REJECT</v-btn>
        </v-list-item>
      </template>
    </ListItem>
    <v-list-item>
      <span class="text-blue-grey-lighten-2">
        {{ requests.length === 0 ? 'No requests' : requests.length === 1 ? '1 request in total' : requests.length + ' requests in total'}}
      </span>
    </v-list-item>
  </List>
</template>

<style scoped>
</style>

<script setup lang="ts">
import {computed, watch} from 'vue';
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {activeRequestId, contactPageProfileSource, rawRequestList, requests, selectedContactInfo} from "../globals.ts";
import {UserData} from "../utils/structs.ts";

defineProps(["modelValue"]);
defineEmits((["update:modelValue", 'accept', 'reject']))

const requestList = computed(() => {
  const list = [];
  for (const entry of rawRequestList.value) {
    list.push({
      id: entry.id,
      name: entry.name,
      avatar: entry.avatar ? entry.avatar : '/Shenium.png',
      email: entry.email ? entry.email : 'tele@thu.com',
      time: entry.time,
    })
  }
  list.sort((a, b) => {
    if (a === undefined) return -1;
    if (b === undefined) return 1;
    return a.time - b.time;
  });
  return list;
});

watch(activeRequestId, (newValue) => {
  if (newValue < 1) return;
  const userInfo = rawRequestList.value.filter((entry) => entry.id === newValue)[0];
  selectedContactInfo.value = {
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    avatar: getAvatarOrDefault(userInfo.avatar),
    category: "user",
  } as UserData;
  contactPageProfileSource.value = 'requestList';
});



</script>

<template>
  <List class="fill-height" v-model="activeRequestId">
    <ListItem
        v-for="request in requestList"
        :key="request.id"
              :k="request.id"
              class="pa-3 pl-6 chat-list-item text-left"
              :title="request.name"
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

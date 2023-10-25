<script setup>

import {contacts} from "../chat.js";
import {defineProps, ref} from "vue";

const props = defineProps(['displayContact', 'display']);
const newGroupName = ref('');
const editGroupName = () => {
  console.log('New group name:', newGroupName.value);
}

</script>

<template>
  <v-card class="mb-auto mt-6 fill-height" v-show="display">
    <v-card-title class="mt-10 font-weight-bold" style="font-size: 30px">
      Members
    </v-card-title>
    <v-divider class="ma-8"/>
      <v-row class="mt-5 align-center ma-5" no-gutters justify="center">
        <v-col
            v-for="member in displayContact.members"
            :key="member"
            cols="3"
            class="d-flex flex-column align-center ma-auto mb-5"
        >
          <v-avatar size="60">
            <v-img :src="member.avatar" id="member-avatar" cover/>
          </v-avatar>
          <p>{{ member.name }}</p>
        </v-col>
        <v-col cols="3" class="d-flex flex-column align-center ma-auto mb-5">
          <v-avatar size="60" color="indigo">
            <v-icon style="font-size: 35px;">mdi-account-multiple-plus</v-icon>
          </v-avatar>
          <p class="text-indigo">...</p>
        </v-col>
      </v-row>
    <v-divider class="ma-4"/>
      <v-col>
        <v-row style="display: flex; align-items: center;" class="ma-3">
          <p style="flex: 1">Rename:</p>
          <v-text-field
              variant="solo"
              label="New group name"
              density="compact"
              style="flex: 2"
              hide-details
              append-inner-icon="mdi-pencil"
              v-model="newGroupName"
              @click:append-inner="editGroupName"
          />
        </v-row>
        <v-row style="display: flex; align-items: center;" class="ma-1">
          <p style="flex: 1">Mute:</p>
          <v-switch style="flex: 2" hide-details color="indigo"></v-switch>
        </v-row>
        <v-row style="display: flex; align-items: center;" class="ma-1">
          <p style="flex: 1">Pin:</p>
          <v-switch style="flex: 2" hide-details color="indigo"></v-switch>
        </v-row>
      </v-col>
    <v-divider class="ma-4"/>
    <v-card-actions style="display: flex; justify-content: center;">
      <v-btn color="error" style="font-size: 15px; font-weight: bold">Leave group</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>
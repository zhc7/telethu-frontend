<script setup>

import {contacts} from "../chat.js";

const props = defineProps(['displayContact', 'display'])

</script>

<template>
  <v-card class="mb-auto mt-6 fill-height" v-show="display">
    <v-card-title class="mt-10">
      Members
    </v-card-title>
    <div>
      <v-row class="mt-5 align-center" no-gutters justify="center">
        <v-col
            v-for="member in displayContact.members"
            :key="member"
            cols="3"
            class="d-flex flex-column align-center ma-1 mb-4"
        >
          <v-avatar size="60">
            <v-img :src="member.avatar" id="member-avatar" cover/>
          </v-avatar>
          <p>{{member.name}}</p>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>
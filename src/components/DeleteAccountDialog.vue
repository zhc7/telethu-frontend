<script setup lang="ts">

import {ref} from "vue";

const emit = defineEmits(['update:showDialog']);
const password = ref("");
const cancelDeleteAccount = () => {
  password.value = "";
  emit('update:showDialog', false);
}
const deleteAccount = () => {
  emit('update:showDialog', false);
}

</script>

<template>
  <v-dialog max-height="90vh" max-width="25vw">
    <v-card>
      <v-card-title class="ma-4"><h3>Delete Account</h3></v-card-title>
      <v-alert
          type="warning"
          colored-border
          border-left
          elevation="2"
          color="amber darken-2"
          class="ml-8 mr-8 mb-4"
      >
        <v-row no-gutters align="center">
          <v-col cols="12">
            <div class="headline mb-2">Are you sure?</div>
            <div>This operation cannot be undone.</div>
          </v-col>
        </v-row>
      </v-alert>
      <v-card-text>
        <p class="ma-2 mb-2 mt-0" style="font-size: large; font-weight: bold">Your password</p>
        <p class="ma-2 mb-6" style="color: #888888; font-size: small">Enter your password to confirm the deletion of your account.</p>
        <v-text-field
            v-model="password"
            label="Password"
            type="password"
            variant="outlined"
            class="ma-2"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancelDeleteAccount">Cancel</v-btn>
        <v-btn @click="deleteAccount" color="red">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
<script setup lang="ts">
import {snackbar, snackbarColor, snackbarText, snackbarTimeout} from "./globals.ts";
</script>

<template>
  <v-app>
    <router-view/>

    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn :color="snackbarColor" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style scoped></style>

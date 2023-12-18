<script setup lang="ts">
import {snackbar, snackbarColor, snackbarText} from "./globals.ts";
</script>

<template>
  <v-app>
    <router-view/>
  </v-app>

  <v-snackbar v-model="snackbar" :timeout="2000">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn :color="snackbarColor" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped></style>

<script setup lang="ts">
</script>

<template>
  <v-row>
    <v-col cols="4" class="text-right">
      <slot name="title" />
    </v-col>
    <v-col cols="8" class="text-left">
      <slot name="content" />
    </v-col>
  </v-row>
</template>

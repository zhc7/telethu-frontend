<script setup>
import {ref} from "vue";

const editingMessage = ref([])

</script>

<template>
  <v-textarea v-model="editingMessage">

  </v-textarea>
</template>
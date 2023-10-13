<script setup>
import {ref} from "vue";

const editingMessage = ref([])

</script>

<template>
  <v-row no-gutters class="message-text-area">
    <v-textarea v-model="editingMessage">

    </v-textarea>
  </v-row>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.message-text-area {
  height: 66vh;
}
</style>
<script setup lang="ts">

import {bigImageSource, showBigImage} from "../globals";
</script>

<template>
  <v-dialog
      v-model="showBigImage"
      class="justify-center align-content-center"
      max-width="70vw"
      @click="showBigImage=false"
  >
    <v-img
        height="70vh"
        :src="bigImageSource"
        class="justify-center align-content-center"

    />
  </v-dialog>
</template>

<style scoped>

</style>
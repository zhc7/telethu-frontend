<script setup lang="ts">

import {ref} from "vue";

const selection = ref<number>(0);
</script>

<template>
  <v-row class="d-flex flex-row mt-auto overflow-y-auto fill-height justify-center align-self-center">
    <v-card>
      <v-card-title>
        Purchase Money to Become Stronger!
      </v-card-title>
      <v-card-subtitle>Purchase now for a desirable discount!</v-card-subtitle>
      <v-divider class="pa-4 ma-4"></v-divider>
      <v-row>
        <v-col cols="4">
          <v-btn align="center" :class="{'v-btn--active': selection===0}" @click="selection=0">¥6</v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn align="center" :class="{'v-btn--active': selection===1}" @click="selection=1">¥30</v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn align="center" :class="{'v-btn--active': selection===2}" @click="selection=2">¥68</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-btn align="center" :class="{'v-btn--active': selection===3}">¥128</v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn align="center" :class="{'v-btn--active': selection===4}">¥328</v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn align="center" :class="{'v-btn--active': selection===5}">¥648</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-row>
</template>

<style scoped>
.v-btn {
  height: 12vh;
  width: 24vw;
}

.v-btn--active {
  background-color: goldenrod;
  color: white!important;
}
</style>
<script setup lang="ts">
import {computed} from "vue";

const props = defineProps(['title', 'content', 'showDialog', 'irreversible']);
const emit = defineEmits(['update:showDialog', 'confirm'])

const dialog = computed({
  get: () => props.showDialog,
  set: (value) => emit('update:showDialog', value)
})
</script>

<template>
  <v-dialog max-width="30vw" v-model="dialog">
    <v-card>
      <v-alert
          type="warning"
          class="ma-4"
          colored-border
          border-left
          elevation="2"
          color="amber darken-2"
      >
        <v-row no-gutters align="center">
          <v-col cols="12">
            <h3 class="headline mb-2">{{title}}</h3>
            <div class="mb-1">{{content}}</div>
            <div v-if="irreversible" style="color: red; font-weight: bold">Alert: This operation cannot be undone.</div>
          </v-col>
        </v-row>
      </v-alert>
      <v-card-actions class="justify-end pa-4">
        <v-btn color="grey darken-1" @click="emit('update:showDialog')">Cancel</v-btn>
        <v-btn color="red darken-2" dark @click="emit('confirm')">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
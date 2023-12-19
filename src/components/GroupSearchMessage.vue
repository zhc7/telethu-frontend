<script setup lang="ts">

import {computed, ref} from "vue";
import {getUser} from "../core/data.ts";
import {Message} from "../utils/structs.ts";
import axios from "axios";
import {BASE_API_URL} from "../constants.ts";
import {token} from "../auth.ts";


const props = defineProps<{
  showDialog: boolean,
  groupId: number,
}>();
const emit = defineEmits(['update:showDialog', 'confirm', 'cancel']);

const dialog = computed({
  get: () => props.showDialog,
  set: (value) => {
    emit('update:showDialog', value)
  }
});

const fromTime = ref<number>(0);
const toTime = ref<number>(0);

const messageContentInput = ref<string>('');

const messageList = ref<Message []>([])

const searchFromBack = async () => {
  const result = await axios.get(BASE_API_URL + 'chat/filter?' +
      'id=' + props.groupId + '&' +
      (fromTime.value === 0 ? '' : ('from=' + +new Date(fromTime.value))) + '&' +
      (toTime.value === 0 ? '' : ('to=' + +new Date(toTime.value))) + '&' +
      (messageContentInput.value === '' ? '' : ('content=' + messageContentInput.value)), {
        headers: {
          Authorization: token.value
        }
      });
  console.log(result);
}

</script>

<template>
  <v-dialog v-model="dialog" max-width="60vw" max-height="90vh">
    <v-card class="fill-height overflow-y-auto">
      <v-card-title class="text-center">
        Search for Message in Group {{ getUser(groupId).name }}
      </v-card-title>
      <v-card-text class="overflow-y-auto d-flex flex-column">
        <label>From</label>
        <input type="datetime-local" v-model="fromTime"/>
        <label>To</label>
        <input type="datetime-local" v-model="toTime"/>
        <v-text-field
            density="compact"
            label="Message Content"
            v-model="messageContentInput"
            variant="outlined"
        />
        <v-btn @click="searchFromBack">Search</v-btn>
      </v-card-text>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer/>
        <v-btn @click="dialog=false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
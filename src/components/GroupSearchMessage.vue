<script setup lang="ts">

import {computed, ref} from "vue";
import {getUser} from "../core/data.ts";
import {Message} from "../utils/structs.ts";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "../constants.ts";
import {token} from "../auth.ts";
import {activeMessageId} from "../globals.ts";
import MessagePopItem from "./MessagePopItem.vue";
import List from "./List.vue";
import {callSnackbar} from "../utils/snackbar.ts";


const props = defineProps<{
  showDialog: boolean,
  contactId: number,
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
const messageTypes = ['text', 'image', 'video', 'audio', 'file'];
const selectedMessageType = ref<string>('text');

const messageContentInput = ref<string>('');


const searchFromBack = async () => {
  const params = {
    id: props.contactId,
  };
  if (fromTime.value) {
    params.from = +new Date(fromTime.value);
  }
  if (toTime.value) {
    params.to = +new Date(toTime.value);
  }
  if (messageContentInput.value) {
    params.content = messageContentInput.value;
  }
  if (selectedMessageType.value) {
    params.m_type = messageTypes.indexOf(selectedMessageType.value);
  }
  if (params.m_type === -1) {
    delete params.m_type;
  }
  console.log(params)
  const result = await axios.get(BASE_API_URL + 'chat/filter', {
    params,
    headers: {
      Authorization: token.value,
    }
  }).then((res) => {
    resultMessages.value = res.data;
    callSnackbar(resultMessages.value.length + ' messages found', 'success')
  }).catch((err) => callSnackbar(err.response.data.message, 'error'));
  if (DEBUG) console.log(result);
}

const resultMessages = ref<Message []>([]);
const zero = ref(0);

</script>

<template>
  <v-dialog v-model="dialog" max-width="40vw" max-height="90vh">
    <v-card class="fill-height overflow-y-auto">
      <v-card-title class="text-h5 text-center my-3 ma-4">
        Search for Message in Group {{ getUser(contactId).name }}
      </v-card-title>
      <v-card-text class="overflow-y-auto d-flex flex-column">
        <div style="margin-left: 5vw; margin-right: 5vw">
              <v-text-field
                  v-model="fromTime"
                  label="From"
                  type="datetime-local"
                  variant="underlined"
                  density="compact"
              ></v-text-field>
              <v-text-field
                  v-model="toTime"
                  label="To"
                  type="datetime-local"
                  variant="underlined"
                  density="compact"
              ></v-text-field>
          <v-select
              :items="messageTypes"
              label="Select Message Type"
              v-model="selectedMessageType"
              class="my-2"
              variant="outlined"
              density="compact"
          ></v-select>
          <v-text-field
              class="my-2"
              label="Message Content"
              v-model="messageContentInput"
              variant="outlined"
              density="compact"
          />
        </div>
        <div class="button-container">
          <v-btn color="primary" @click="searchFromBack" variant="tonal">Search</v-btn>
        </div>
        <v-divider class="my-2" v-if="resultMessages.length"></v-divider>
        <List v-if="resultMessages.length" class="overflow-y-auto" min-height="15vh" v-model="activeMessageId">
          <MessagePopItem
              :jump="true"
              v-for="msg in resultMessages"
              :full-message="msg"
              :active="false"
          />
        </List>
      </v-card-text>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer/>
        <v-btn color="grey darken-1" @click="dialog=false; resultMessages=[]">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-text-field {
  width: 100%;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.button-container {
  display: flex;
  justify-content: center;
}
</style>

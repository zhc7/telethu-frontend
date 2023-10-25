<script setup>

import {ref} from "vue";

const props = defineProps(['displayContact', 'display'])
const friendCircle = ref(['THU', 'PKU', 'CMU', 'MIT'])
const friendCircleSelect = ref([])

</script>

<template>
  <v-card class="mb-auto mt-6" v-show="display">
    <v-avatar size="80" class="mt-10">
      <v-img :src="displayContact.avatar" cover/>
    </v-avatar>
    <v-card-item>
      <v-list>
        <v-list-item-title>
          {{ displayContact.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          @{{ displayContact.id }}
        </v-list-item-subtitle>
        <v-divider class="ma-4"/>
        <v-list-item class="text-grey-darken-3">
          <div>
            <v-row>
              <v-col cols="4" offset="" class="text-right">
                Location:
              </v-col>
              <v-col cols="8" class="text-left">
                Beijing, China Mainland
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="text-right">
                Phone:
              </v-col>
              <v-col cols="8" class="text-left">
                1145141919810
              </v-col>
            </v-row>
            <v-row v-if="displayContact.email">
              <v-col cols="4" class="text-right">
                Email:
              </v-col>
              <v-col cols="8" class="text-left">
                <a href="#">{{ displayContact.email }}</a>
              </v-col>
            </v-row>
          </div>
        </v-list-item>
      </v-list>
      <v-divider class="ma-4"/>
      <v-col>
        <v-row style="display: flex; align-items: center;" class="ma-3">
          <p style="flex: 1">Label:</p>
          <v-combobox
              v-model="friendCircleSelect"
              chips
              :items="friendCircle"
              clearable
              multiple
              variant="solo"
              density="compact"
              hide-details
              style="flex: 2"
          ></v-combobox>
        </v-row>
        <v-row style="display: flex; align-items: center;" class="ma-1">
          <p style="flex: 1">Mute:</p>
          <v-switch style="flex: 2" hide-details color="indigo"></v-switch>
        </v-row>
        <v-row style="display: flex; align-items: center;" class="ma-1">
          <p style="flex: 1">Pin:</p>
          <v-switch style="flex: 2" hide-details color="indigo"></v-switch>
        </v-row>
        <v-row style="display: flex; align-items: center;" class="ma-1">
          <p style="flex: 1">Block:</p>
          <v-switch style="flex: 2" hide-details color="error"></v-switch>
        </v-row>
      </v-col>
      <v-divider class="ma-4"/>
      <v-card-actions>
        <v-col >
          <v-row style="display: flex; justify-content: center">
            <v-btn color="indigo" style="font-size: 15px; font-weight: bold">Recommend</v-btn>
          </v-row>
          <v-row style="display: flex; justify-content: center">
          <v-btn color="error" style="font-size: 15px; font-weight: bold">Delete Friend</v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>
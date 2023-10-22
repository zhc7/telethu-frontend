<script setup>
import {ref, watch} from "vue";

const props = defineProps(['displayContact'])
const dialog = ref(false)

</script>

<template>
  <v-btn variant="text" @click="dialog = true">
    <v-icon>mdi-account</v-icon>
    <span class="pl-2">Profile</span>
  </v-btn>

  <v-dialog v-model="dialog" width="auto">
  <v-card class="mb-auto mt-6">
    <v-avatar size="80">
      <v-img :src="displayContact.avatar" cover/>
    </v-avatar>
    <v-card-item>
      <v-list>
        <v-list-item-title>
          {{ displayContact.username }}
        </v-list-item-title>
        <v-list-item-subtitle>
          @{{ displayContact.id }}
        </v-list-item-subtitle>
        <v-divider class="ma-4"/>
        <v-list-item class="text-grey-darken-3">
          <v-row>
            <v-col cols="4" offset="1" class="text-right">
              Location:
            </v-col>
            <v-col cols="6" class="text-left">
              Beijing, China Mainland
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" offset="1" class="text-right">
              Phone:
            </v-col>
            <v-col cols="6" class="text-left">
              1145141919810
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" offset="1" class="text-right">
              Email:
            </v-col>
            <v-col cols="6" class="text-left">
              <a href="#">Cindy@telethu.org</a>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
      <v-divider class="ma-4"/>
      <v-card-actions class="justify-center">
        <v-btn-group color="info" variant="outlined" divided>
          <v-btn>RECOMMEND</v-btn>
          <v-btn>DELETE</v-btn>
          <v-btn @click="">BLOCK</v-btn>
        </v-btn-group>
      </v-card-actions>
    </v-card-item>

    <v-card-actions>
      <v-btn color="primary" @click="dialog = false">Close Dialog</v-btn>
    </v-card-actions>
  </v-card>

  </v-dialog>
</template>

<style scoped>

</style>
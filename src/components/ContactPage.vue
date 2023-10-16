<script setup>
import {ref, reactive, defineProps, defineEmits} from "vue";
import {fakeContacts} from "../testdata/fakechats.js";
import ContactList from "./ContactList.vue";
const selectedContact = ref(undefined);

const contactList = ref(fakeContacts);
</script>

<template>
  <v-row class="mt-auto mb-2 d-flex flex-1-1 overflow-y-auto fill-height">
    <v-col cols="12" sm="4">
      <ContactList/>
    </v-col>
  </v-row>
</template>
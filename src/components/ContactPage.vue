<script setup>
import {defineProps, ref} from "vue";
import ContactList from "./ContactList.vue";

const props = defineProps(['contacts']);
const emits = defineEmits((['chat']));

const selectedContact = ref();

const selectContact = (newContactId) => {
  props.contacts.forEach((contact) => {
    if (contact.id === newContactId) {
      selectedContact.value = contact;
    }
  })
};

</script>

<template>
  <v-row class="mt-auto mb-2 d-flex flex-1-1 overflow-y-auto fill-height">
    <v-col cols="12" sm="4">
      <ContactList
          :contacts="contacts"
          @select="(newContactId) => selectContact(newContactId)"
      />
    </v-col>
    <v-col cols="12" sm="6" class="d-flex flex-column flex-1-1 justify-center offset-sm-1">
      <v-card v-if="selectedContact" class="mb-auto mt-6">
        <v-avatar size="80">
          <v-img :src="selectedContact.avatar"/>
        </v-avatar>
        <v-card-item>
          <v-list>
            <v-list-item-title>
              {{ selectedContact.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              @{{ selectedContact.id }}
            </v-list-item-subtitle>
            <v-list-item-title v-if="selectedContact.name">
              {{ selectedContact.title }}
            </v-list-item-title>
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
                  <a :href="'#'">Cindy@telethu.org</a>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
          <v-divider class="ma-4"/>
          <v-card-actions class="justify-center">
            <v-btn-group justify="center">
              <v-btn color="green" class="ma-1" @click="$emit('chat', selectedContact)">CHAT</v-btn>
              <v-btn color="info" class="ma-1">RECOMMEND</v-btn>
              <v-btn color="red" class="ma-1">DELETE</v-btn>
              <v-btn color="grey" class="ma-1" @click="">BLOCK</v-btn>
            </v-btn-group>
          </v-card-actions>
        </v-card-item>
      </v-card>

    </v-col>
  </v-row>
</template>
<script setup>
import {ref, watch} from "vue";
import ContactList from "./ContactList.vue";
import {acceptFriend, contacts} from "../chat.js";
import {addFriend} from "../chat.js";

defineEmits((['chat']));

const selectedContactId = ref();

const selectedContact = ref();

const friendId = ref();

const selectContact = (newContactId) => {
  selectedContact.value = contacts.value[newContactId];
};

watch(selectedContactId, selectContact);

</script>

<template>
  <v-row class="mt-auto mb-2 d-flex flex-1-1 overflow-y-auto fill-height">
    <v-col cols="12" sm="4">
      <v-text-field label="friendId" v-model="friendId"/>
      <v-btn @click="addFriend(friendId)">Add</v-btn>
      <v-btn @click="acceptFriend(friendId)">Accept</v-btn>
      <ContactList
          v-model="selectedContactId"
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
              {{ selectedContact.username }}
            </v-list-item-title>
            <v-list-item-subtitle>
              @{{ selectedContact.id }}
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
              <v-btn @click="$emit('chat', selectedContactId)">CHAT</v-btn>
              <v-btn>RECOMMEND</v-btn>
              <v-btn>DELETE</v-btn>
              <v-btn @click="">BLOCK</v-btn>
            </v-btn-group>
          </v-card-actions>
        </v-card-item>
      </v-card>

    </v-col>
  </v-row>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>
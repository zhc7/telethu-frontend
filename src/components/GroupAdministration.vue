<script setup lang="ts">

import {computed, ref} from "vue";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {contacts, user} from "../globals.ts";
import {isOwner} from "../utils/grouprole.ts";


const props = defineProps<{
  showDialog: boolean,
  groupId: number,
}>();
const emit = defineEmits(['update:showDialog', 'confirm', 'cancel', 'changeOwnership', 'dismissGroup', 'renameGroup']);

const dialog = computed({
  get: () => props.showDialog,
  set: (value) => {
    emit('update:showDialog', value)
  }
});

const entryList = ref<Array<{
  id: number,
}>>(contacts.value.map(i => {
  return {id: i}
}));

</script>

<template>
  <v-dialog v-model="dialog" max-width="60vw" max-height="90vh">
    <v-card class="fill-height overflow-y-auto">
      <v-card-title class="text-center">
        Group Administration
      </v-card-title>
      <v-card-text class="overflow-y-auto d-flex flex-column">
        <List class="overflow-y-auto flex-1-1">
          <v-list-item-title>Group Candidates</v-list-item-title>
          <v-divider class="ma-3"></v-divider>
          <ListItem
              v-for="entry in entryList"
              :title="getUser(entry.id).name"
              :subtitle="entry.id"
              :k="entry.id"
          >
            <template #prepend>
              <Avatar :contact-id="entry.id"/>
            </template>
            <template #append>
              <v-list-item class="v-btn--density-compact">
                <v-btn class="v-btn--density-comfortable mr-1 bg-green">Accept</v-btn>
                <v-btn class="v-btn--density-comfortable ml-1 bg-red">Reject</v-btn>
              </v-list-item>
            </template>
          </ListItem>
        </List>
        <v-list-item-action>
          <v-btn
              v-if="isOwner(user.id, groupId)"
              color="primary"
              @click="$emit('changeOwnership')"
          >Change Ownership
          </v-btn>
          <v-btn
              v-if="isOwner(user.id, groupId)"
              color="indigo"
              @click="$emit('renameGroup')"
          >Rename Group
          </v-btn>
          <v-btn color="red-darken-4" v-if="isOwner(user.id, groupId)"
                 @click="$emit('dismissGroup')">Dismiss
          </v-btn>

        </v-list-item-action>
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
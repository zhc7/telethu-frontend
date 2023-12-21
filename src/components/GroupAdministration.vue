<script setup lang="ts">

import {computed, watch} from "vue";
import Avatar from "./Avatar.vue";
import {getCandidateList, getUser} from "../core/data.ts";
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {candidatesList, user} from "../globals.ts";
import {isOwner} from "../utils/grouprole.ts";
import {groupAddMember, rejectCandidate} from "../core/groups/send.ts";


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

const entryList = computed(() => {
  if (!candidatesList.value[props.groupId]) return [];
  return candidatesList.value[props.groupId];
});

watch(props, () => {
  getCandidateList(props.groupId);
}, {immediate: true})

</script>

<template>
  <v-dialog v-model="dialog" max-width="40vw" max-height="90vh">
    <v-card class="fill-height overflow-y-auto">
      <v-card-title class="text-center" style="font-size: 20px; font-weight: bold; color: #333;">
        Group Administration
      </v-card-title>
      <v-card-text class="overflow-y-auto d-flex flex-column py-4">
        <List class="overflow-y-auto flex-1-1">
          <v-list-item-title class="mb-3" style="font-weight: bold; color: #555;">Group Candidates
          </v-list-item-title>
          <v-divider class="my-4"></v-divider>
          <ListItem
              v-for="entry in entryList"
              :title="getUser(entry).name"
              :subtitle="'@' + entry"
              :k="entry"
              class="mb-2"
          >
            <template #prepend>
              <Avatar :contact-id="entry"/>
            </template>
            <template #append>
              <v-list-item class="v-btn--density-compact">
                <v-btn class="v-btn--density-comfortable mr-1 bg-green" @click="groupAddMember(groupId, [entry])">
                  Accept
                </v-btn>
                <v-btn class="v-btn--density-comfortable ml-1 bg-red" @click="rejectCandidate(groupId, entry)">Reject
                </v-btn>
              </v-list-item>
            </template>
          </ListItem>
          <!-- no result -->
          <v-list-item v-if="!entryList.length" class="text-center">
            No candidates
          </v-list-item>
        </List>
        <v-list-item-action class="justify-center mt-5">
          <div class="d-flex flex-column">
            <v-btn
                v-if="isOwner(user.id, groupId)"
                color="primary"
                variant="tonal"
                class="mb-2"
                @click="$emit('changeOwnership')"
            >Change Ownership
            </v-btn>
            <v-btn
                v-if="isOwner(user.id, groupId)"
                color="indigo"
                variant="tonal"
                class="mb-2"
                @click="$emit('renameGroup')"
            >Rename Group
            </v-btn>
            <v-btn color="red-darken-4" v-if="isOwner(user.id, groupId)"
                   variant="tonal"
                   @click="$emit('dismissGroup')"
            >Dismiss
            </v-btn>
          </div>
        </v-list-item-action>
      </v-card-text>
      <v-card-actions class="mt-3 mr-4 justify-end">
        <v-btn color="grey darken-1" @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
<script setup>

import {contacts, groupAddMember} from "../chat.js";
import {ref, computed} from "vue";

const props = defineProps(['displayContact', 'display'])

const groupAddMemberDialog = ref(false);
const groupAddMemberLoading = ref(false);
const groupAddMemberSelecting = ref([]);

const handleSelect = (contact) => {
  console.log(contact);
  groupAddMemberSelecting.value.push(contact.id);
};

const handlePlusMember = () => {
  console.log('log', groupAddMemberSelecting.value + '', 'disContId', props.displayContact.id);
  groupAddMemberLoading.value = true;
  for (const id of groupAddMemberSelecting.value) {
    console.log('Adding group member', props.displayContact.id, id);
    const contact = contacts.value[id];
    groupAddMember(props.displayContact.id, id);
    const memberInfo = {
      'id': contact.id,
      'name': contact.name,
      'avatar': contact.avatar,
    };
    contacts.value[props.displayContact.id].id2member[contact.id] = memberInfo;
    contacts.value[props.displayContact.id].members.push(memberInfo);
  }
  groupAddMemberSelecting.value = [];
  groupAddMemberLoading.value = false;
  groupAddMemberDialog.value = false;
};

const handlePlus = () => {
  groupAddMemberDialog.value = true;
  groupAddMemberSelecting.value = [];
}

const filterContacts = computed(() => {
  return Object.keys(contacts.value).filter((id) => {
    return contacts.value[id].category === 'user' && (groupAddMemberSelecting.value.indexOf(id) === -1) && (Object.keys(props.displayContact.id2member).indexOf(id) === -1);
  }).map((id) => {
    return {
      id: id,
      name: contacts.value[id].name,
      avatar: contacts.value[id].avatar,
    }
  });
});

</script>

<template>
  <v-card class="mb-auto mt-6 overflow-y-auto" v-show="display">
    <v-avatar size="80" class="mt-5">
      <v-img :src="displayContact.avatar" cover/>
    </v-avatar>
    <v-card-item class="overflow-y-auto">
      <v-list class="overflow-y-auto">
        <v-list-item-title>
          {{ displayContact.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          @{{ displayContact.id }}
        </v-list-item-subtitle>
        <v-list-item v-if="displayContact.category === 'user'" class="text-grey-darken-3">
          <v-divider class="ma-4"/>
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
        <div v-if="displayContact.category === 'group'" class="overflow-y-auto fill-height">
          <v-divider class="ma-4"/>
          <v-card-title class="ma-3">
            Members
          </v-card-title>
          <div class="overflow-y-auto fill-height d-flex flex-wrap">
            <div
                v-for="member in displayContact.members"
                :key="member"
                class="d-flex flex-column align-center ma-auto mb-5"
            >
              <v-avatar size="60">
                <v-img :src="member.avatar" id="member-avatar" cover/>
              </v-avatar>
              <p>{{ member.name }}</p>
            </div>
            <div class="d-flex flex-column align-center ma-auto mb-5">
              <v-avatar size="60" color="indigo" @click="handlePlus">
                <v-icon style="font-size: 35px;">mdi-account-multiple-plus</v-icon>
              </v-avatar>
              <p class="text-indigo">...</p>
            </div>
          </div>
        </div>
      </v-list>
      <v-divider class="ma-4"/>
      <v-card-actions class="justify-center">
        <v-btn-group color="info" variant="outlined" divided>
          <slot name="btn"/>
        </v-btn-group>
      </v-card-actions>
    </v-card-item>
  </v-card>

  <v-dialog v-model="groupAddMemberDialog" max-width="50vw">
    <v-card>
      <v-card-title class="text-center">
        Add members
      </v-card-title>
      <v-card-text>
        <v-text-field
            density="compact"
            label="Search"
        />
        <div class="d-flex overflow-x-auto" v-if="groupAddMemberSelecting">
          <div
              v-for="member in displayContact.members"
              :key="member"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              v-ripple
          >
            <v-avatar>
              <v-img :src="member.avatar" cover></v-img>
            </v-avatar>
            <p>{{ member.name }}</p>
          </div>
          <div
              v-for="id in groupAddMemberSelecting"
              :key="id"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              @click="groupAddMemberSelecting = groupAddMemberSelecting.filter((i) => i.id !== id)"
              v-ripple
          >
            <v-avatar>
              <v-img :src="contacts[id].avatar" cover></v-img>
            </v-avatar>
            <p>{{ contacts[id].name }}</p>
          </div>
        </div>
        <v-list>
          <v-list-item v-for="contact in filterContacts">
            <template #prepend>
              <v-avatar>
                <v-img :src="contact.avatar" cover></v-img>
              </v-avatar>
            </template>
            <v-list-item-title>
              {{ contact.name }}
            </v-list-item-title>
            <template #append>
              <v-btn @click="handleSelect(contact)">
                Append
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer/>
        <v-btn @click="groupAddMemberDialog = false">Cancel</v-btn>
        <v-btn @click="handlePlusMember" :loading="groupAddMemberLoading">Add</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>
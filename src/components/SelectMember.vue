<script setup>

import {computed, ref, defineProps, onMounted} from "vue";
import {contacts, createGroup} from "../chat.js";

const props = defineProps(['showDialog', 'type', 'title'])
const emit = defineEmits(['update:showDialog']);
const createGroupName = ref('')
const selected = ref([])

const filterContacts = computed(() => {
  return Object.keys(contacts.value).filter((id) => {
    return contacts.value[id].category === 'user';
  }).map((id) => {
    return {
      id: contacts.value[id].id,  // id should be int
      name: contacts.value[id].name,
      avatar: contacts.value[id].avatar,
    }
  });
});

const dialog = computed({
  get: () => props.showDialog,
  set: (value) => emit('update:showDialog', value)
});

const dispatchFunction = () => {
  if (props.type === 'create_group') {
    console.log("create group", createGroupName.value, selected.value);
    createGroup(createGroupName.value, selected.value);
    selected.value = [];
    dialog.value = false;
  }

}

onMounted(() => {
  selected.value = [];
  console.log("mounted", props.type);
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="30vw" max-height="80vh">
    <v-card class="fill-height overflow-y-auto">
      <v-card-title class="text-center">
        {{ title }}
      </v-card-title>
      <v-card-text class="overflow-y-auto d-flex flex-column">
        <v-text-field
            density="compact"
            label="group name"
            v-model="createGroupName"
            variant="outlined"
            v-if="type === 'create_group'"
        />
        <v-text-field
            density="compact"
            label="Search"
        />
        <div class="d-flex overflow-x-auto flex-shrink-0" v-if="selected">
          <div
              v-for="id in selected"
              :key="id"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              @click="selected = selected.filter((i) => i !== id)"
              v-ripple
          >
            <v-avatar>
              <v-img :src="contacts[id].avatar" cover></v-img>
            </v-avatar>
            <p>{{ contacts[id].name }}</p>
          </div>
        </div>
        <v-list class="overflow-y-auto flex-1-1">
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
              <v-checkbox
                  v-model="selected"
                  :value="contact.id"
                  color="blue"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer/>
        <v-btn @click="() => {dialog = false; selected = []}">Cancel</v-btn>
        <v-btn @click="dispatchFunction">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
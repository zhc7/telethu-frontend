<script setup>

import {computed, onMounted, ref} from "vue";
import {createGroup, groupAddMember} from "../core/chat.ts";
import {contacts} from "../globals.ts";

const props = defineProps(['showDialog', 'type', 'title', 'displayContact'])
const emit = defineEmits(['update:showDialog']);
const createGroupName = ref('')
const selected = ref([])

const filterContacts = computed(() => {
  return Object.keys(contacts.value).filter((id) => {
    if (props.type === 'create_group') {
      return contacts.value[id].category === 'user';
    } else if (props.type === 'add_group_member') {
      return contacts.value[id].category === 'user' && Object.keys(props.displayContact.id2member).indexOf(id) === -1;
    } else if (props.type === 'create_group_from_contact') {
      return contacts.value[id].category === 'user' && id !== props.displayContact.id;
    }
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

  else if (props.type === 'add_group_member') {
    console.log(
        "log",
        selected.value + "",
        "disContId",
        props.displayContact.id
    );
    for (const id of selected.value) {
      console.log("Adding group member", props.displayContact.id, id);
      const contact = contacts.value[id];
      groupAddMember(props.displayContact.id, id);
      const memberInfo = {
        id: contact.id,
        name: contact.name,
        avatar: contact.avatar,
      };
      contacts.value[props.displayContact.id].id2member[contact.id] = memberInfo;
      contacts.value[props.displayContact.id].members.push(memberInfo);
    }
    selected.value = [];
    dialog.value = false;
  } else if (props.type === 'create_group_from_contact') {
    // TODO: create group from contact
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
              v-for="member in displayContact.members"
              :key="member"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              v-ripple
              v-if="type === 'add_group_member'"
          >
            <v-avatar>
              <v-img :src="member.avatar" cover></v-img>
            </v-avatar>
            <p>{{ member.name }}</p>
          </div>
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
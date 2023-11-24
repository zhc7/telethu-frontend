<script setup>

import {computed, onMounted, ref} from "vue";
import {createGroup, groupAddMember} from "../core/chat.ts";
import {users} from "../globals.ts";
import {getAvatarOrDefault} from "../core/data.ts";

const props = defineProps(['showDialog', 'type', 'title', 'contactId'])
const emit = defineEmits(['update:showDialog']);
const createGroupName = ref('')
const selected = ref([])

const filterContacts = computed(() => {
  return Object.keys(users.value).filter((id) => {
    if (props.type === 'create_group') {
      return users.value[id].category === 'user';
    } else if (props.type === 'add_group_member') {
      return users.value[id].category === 'user' && Object.keys(users.value[props.contactId]?.id2member)?.indexOf(id) === -1;
    } else if (props.type === 'create_group_from_contact') {
      return users.value[id].category === 'user' && id !== props.contactId;
    }
  }).map((id) => {
    return {
      id: users.value[id].id,  // id should be int
      name: users.value[id].name,
      avatar: users.value[id].avatar,
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
        props.contactId
    );
    for (const id of selected.value) {
      console.log("Adding group member", props.contactId, id);
      const contact = users.value[id];
      groupAddMember(props.contactId, id);
      const memberInfo = {
        id: contact.id,
        name: contact.name,
        avatar: contact.avatar,
      };
      users.value[props.contactId].id2member[contact.id] = memberInfo;
      users.value[props.contactId].members.push(memberInfo);
    }
    selected.value = [];
    dialog.value = false;
  }

  else if (props.type === 'create_group_from_contact') {
    // TODO: create group from contact
    console.log("create group from profile", createGroupName.value, selected.value);
    createGroup(createGroupName.value, selected.value);
    selected.value = [];
    dialog.value = false;
  }

}

onMounted(() => {
  console.log("contactId", props.contactId)
  selected.value = [];
  if (props.type === 'create_group_from_contact') {
    selected.value.push(props.contactId);
  }
  console.log("mounted", props.type, selected.value);
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
              v-for="member in users[contactId]?.members"
              :key="member"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              v-ripple
              v-if="type === 'add_group_member'"
          >
            <v-avatar>
              <v-img :src="getAvatarOrDefault(member.avatar)" cover></v-img>
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
              <v-img :src="users[id]?.avatar" cover></v-img>
            </v-avatar>
            <p>{{ users[id]?.name }}</p>
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
        <v-btn @click="() => {dialog = false; selected = type === 'create_group_from_contact' ? [contactId] : []}">Cancel</v-btn>
        <v-btn @click="dispatchFunction">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
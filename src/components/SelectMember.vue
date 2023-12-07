<script setup lang="ts">

import {computed, ref, watch} from "vue";
import {createGroup} from "../core/users/send.ts";
import {groupAddMember} from "../core/groups/send.ts";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";
import ListItem from "./ListItem.vue";
import List from "./List.vue";

/**
 * source: chatList, personalFriend, existingGroup, share
 *
 */
const props = defineProps(['showDialog', 'title', 'contactId', 'sharedMessages', 'pinned', 'possible', 'single']);
const emit = defineEmits(['update:showDialog', 'confirm', 'cancel']);
const inputText = ref('');

const selectedStuff = ref([]);

const actUnselect = (id: number) => {
  if (props.single) {
    selectedStuff.value = 0;
    return;
  }
  console.log(selectedStuff.value);
  selectedStuff.value = selectedStuff.value.filter((i) => {
    return id !== i;
  });
};

const dialog = computed({
  get: () => props.showDialog,
  set: (value) => {
    selectedStuff.value = props.single ? 0 : [];
    emit('update:showDialog', value)
  }
});

watch(props.showDialog, (newValue) => {
  if (!newValue) {
    selectedStuff.value = props.single ? 0 : [];
  }
});

const dispatchedMention = (names: Array<number>) => {
  emit('membersSelected', names);
  dialog.value = false;
}

const dispatchFunction = () => {
  const list = [];
  for (const member of props.pinned) {
    list.push(member);
  }
  for (const member of selectedStuff.value) {
    list.push(member);
  }
  if (props.source === 'chatList') {
    dispatchedCreateGroup(list);
  } else if (props.source === 'existingGroup') {
    dispatchedGroupAddMember();
  } else if (props.source === 'personalFriend') {
    dispatchedCreateGroupFromContact();
  } else if (props.source === 'share') {
    dispatchedShare(list);
  } else if (props.source === 'input@mention') {
    dispatchedMention(list);
  }
}

const dispatchedCreateGroup = (list: Array<number>) => {
  createGroup(inputText.value, list);
  dialog.value = false;
}

const dispatchedGroupAddMember = () => {
  groupAddMember(props.baseGroup.id, selectedStuff.value);
  dialog.value = false;
}

const dispatchedCreateGroupFromContact = () => {
  console.log("create group from contact", inputText.value, selectedStuff.value);
  createGroup(inputText.value, selectedStuff.value);
  selectedStuff.value = [];
  dialog.value = false;
}


const positiveButtonText = computed(() => {
  if (props.source === 'personalFriend') {
    return 'Create';
  } else if (props.source === 'existingGroup') {
    return 'Add';
  } else if (props.source === 'chatList') {
    return 'Create';
  } else {
    return 'Confirm';
  }
});

const negativeButtonText = computed(() => {
  return 'Cancel';
})

const emitValue = computed(() => {
  if (props.single) {
    return selectedStuff.value;
  }
  const l = [];
  for (const id of selectedStuff.value) {
    l.push(id);
  }
  for (const id of props.pinned) {
    l.push(id);
  }
  return l;
});

</script>

<template>
  <v-dialog v-model="dialog" max-width="40vw" max-height="90vh">
    <v-card class="fill-height overflow-y-auto">
      <v-card-title class="text-center">
        {{ title }}
      </v-card-title>
      <v-card-text class="overflow-y-auto d-flex flex-column">
        <v-text-field
            density="compact"
            label="group name"
            v-model="inputText"
            variant="outlined"
        />
        <v-text-field
            density="compact"
            label="Search"
        />
        <div class="d-flex overflow-x-auto flex-shrink-0">
          <div
              v-for="member in pinned"
              :key="member"
              class="d-flex flex-column align-center bg-indigo rounded-lg pa-1 ma-1"
              v-ripple
              style="max-width: 40px"
          >
            <Avatar :contact-id="member"/>
            <p>{{ getUser(member).name }}</p>
          </div>
          <div
              v-if="!single"
              v-for="member in selectedStuff"
              :key="member"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              @click="actUnselect(member)"
              v-ripple
              :style="'max-width: 40px'"
          >
            <Avatar :contact-id="member"/>
            <p>{{ getUser(member).name }}</p>
          </div>
        </div>
        <List class="overflow-y-auto flex-1-1" :mode="single ? 'single' : 'multi'" v-model="selectedStuff">
          <ListItem
              v-for="member in possible"
              :title="getUser(member).name"
              :k="member"
              :pin="props.pinned.includes(member)"
          >
            <template #prepend>
              <Avatar :contact-id="member"/>
            </template>
          </ListItem>
        </List>
      </v-card-text>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer/>
        <v-btn @click="dialog=false">
          {{ negativeButtonText }}
        </v-btn>
        <v-btn @click="$emit('confirm', emitValue, inputText)">{{ positiveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
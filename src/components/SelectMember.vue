<script setup lang="ts">

import {computed, ref} from "vue";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {contacts} from "../globals.ts";
import {applyFriend} from "../core/users/send.ts";

/**
 * source: chatList, personalFriend, existingGroup, share
 *
 */
const props = withDefaults(defineProps<{
  showDialog: boolean,
  title?: string,
  pinned?: Array<number>,
  possible?: Array<number>,
  single?: boolean,
  positiveButtonText?: string,
}>(), {
  title: 'Select Member',
  pinned: () => [],
  possible: () => contacts.value,
  single: false,
  positiveButtonText: 'Confirm',
});
const emit = defineEmits(['update:showDialog', 'confirm', 'cancel']);
const inputText = ref('');

const selectedStuff = ref<number | Array<number>>([]);

const actUnselect = (id: number) => {
  if (props.single) {
    selectedStuff.value = 0;
    return;
  }
  console.log(selectedStuff.value);
  selectedStuff.value = (selectedStuff.value as Array<number>).filter((i) => {
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

const negativeButtonText = computed(() => {
  return 'Cancel';
})

const emitValue = computed(() => {
  if (props.single) {
    return selectedStuff.value;
  }
  const l = [];
  for (const id of selectedStuff.value as Array<number>) {
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
        {{ title }}{{ possible }}
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
              v-for="member in selectedStuff as Array<number>"
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
<script setup lang="ts">

import {computed, ref} from "vue";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {activeTagName, contacts, settings} from "../globals.ts";
import {DEBUG} from "../constants.ts";
import TagList from "./TagList.vue";
import TagDetail from "./TagDetail.vue";
import {callSnackbar} from "../utils/snackbar.ts";

const props = withDefaults(defineProps<{
  showDialog: boolean,
  title?: string,
  pinned?: Array<number>,
  possible?: Array<number>,
  single?: boolean,
  positiveButtonText?: string,
  name?: boolean,
  label?: string,
  tags?: boolean,
}>(), {
  title: 'Select Member',
  pinned: () => [],
  possible: () => contacts.value,
  single: false,
  positiveButtonText: 'Confirm',
});
const emit = defineEmits(['update:showDialog', 'confirm', 'cancel']);
const groupName = ref('');
const searchFriend = ref('');


const selectedStuff = ref<number | Array<number>>([]);

const actUnselect = (id: number) => {
  if (props.single) {
    selectedStuff.value = 0;
    return;
  }
  if (DEBUG) console.log(selectedStuff.value);
  selectedStuff.value = (selectedStuff.value as Array<number>).filter((i) => {
    return id !== i;
  });
};

const dialog = computed({
  get: () => props.showDialog,
  set: (value) => {
    selectedStuff.value = props.single ? 0 : [];
    groupName.value = '';
    searchFriend.value = '';
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

const showTagsDialog = ref<boolean>(false);

const handleImport = () => {
  if (!activeTagName.value) return;
  if (!(selectedStuff.value instanceof Array)) {
    selectedStuff.value = [];
  }
  for (const id of settings.value.tags[activeTagName.value]) {
    if (!selectedStuff.value.includes(id)) {
      selectedStuff.value.push(id);
    }
  }
  callSnackbar('Imported ' + settings.value.tags[activeTagName.value].length + ' members', 'success');
}

const confirm = () => {
  emit('confirm', emitValue.value, groupName.value);
  selectedStuff.value = [];
  searchFriend.value = '';
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="30vw" max-height="90vh" @keydown.enter="confirm">
    <v-card class="fill-height overflow-y-auto">
      <v-card-title class="text-center">
        {{ title }}
      </v-card-title>
      <v-card-text class="overflow-y-auto d-flex flex-column">
        <v-text-field
            density="compact"
            :label="label"
            v-model="groupName"
            variant="outlined"
            v-if="name"
        />
        <v-text-field
            density="compact"
            label="Search"
            v-model="searchFriend"
        />
        <v-btn v-if="tags" v-ripple @click="showTagsDialog=true" variant="tonal" class="ma-auto">
          Import from Tags
        </v-btn>
        <div class="d-flex overflow-x-auto flex-shrink-0">
          <div
              v-for="member in pinned"
              :key="member"
              class="d-flex flex-column align-center rounded-lg pa-1 ma-1"
              v-ripple
              style="max-width: 40px"
          >
            <Avatar style="border: 1px solid blue" :contact-id="member"/>
          </div>
          <div
              v-if="!single"
              v-for="member in selectedStuff as Array<number>"
              :key="member"
              class="d-flex flex-column align-center rounded-lg pa-1 ma-1"
              @click="actUnselect(member)"
              v-ripple
              :style="'max-width: 40px'"
          >
            <Avatar style="border: 1px solid blue" :contact-id="member"/>
          </div>
        </div>
        <List class="overflow-y-auto flex-1-1" :mode="single ? 'single' : 'multi'" v-model="selectedStuff">
          <ListItem
              v-for="member in possible.filter((m) => getUser(m).name.includes(searchFriend) && !pinned.includes(m))"
              :title="getUser(member).name"
              :k="member"
              :pin="props.pinned.includes(member)"
          >
            <template #prepend>
              <Avatar :contact-id="member"/>
            </template>
          </ListItem>
        </List>
        <p v-if="possible.length === 0" class="text-center mb-6">No available choice.</p>
      </v-card-text>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer/>
        <v-btn @click="dialog=false; selectedStuff = single ? 0 : [];">
          {{ negativeButtonText }}
        </v-btn>
        <v-btn @click="confirm">{{ positiveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="showTagsDialog" max-width="1200px">
      <v-card min-height="60vh">
        <v-row class="ma-6">
          <v-col cols="4">
            <TagList v-model="activeTagName"/>
          </v-col>
          <v-col cols="8">
            <TagDetail :tag-name="activeTagName" allow-import @imp="handleImport" />
          </v-col>
        </v-row>
        <v-card-actions class="mb-3 mr-4">
          <v-spacer />
          <v-btn @click="showTagsDialog=false">Finish</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<style scoped>

</style>
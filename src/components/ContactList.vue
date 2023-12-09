<script setup lang="ts">
import {computed} from 'vue';
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {activeContactId, contacts} from "../globals.ts";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";

const props = defineProps(["searchInput", "displayType"]);
const personContactList = computed(() => {
  return contacts.value.filter((i) => {
    return getUser(i).category === 'user';
  }).sort((aId, bId) => {
    const a = getUser(aId);
    const b = getUser(bId);
    if (a.id === 0) {
      return 1;
    }
    if (b.id === 0) {
      return -1;
    }
    return a.name.localeCompare(b.name);
  });
});
const groupContactList = computed(() => {
  return contacts.value.filter((i) => {
    return getUser(i).category === 'group';
  }).sort((aId, bId) => {
    const a = getUser(aId);
    const b = getUser(bId);
    if (a.id === 0) {
      return 1;
    }
    if (b.id === 0) {
      return -1;
    }
    return a.name.localeCompare(b.name);
  });
});
const userCount = computed(() => {
  return personContactList.value.length;
});
const groupCount = computed(() => {
  return groupContactList.value.length;
});

const displayList = computed(() => {
  if (props.displayType === 'user') {
    return personContactList.value;
  } else {
    return groupContactList.value;
  }
})

</script>

<template>
  <List class="fill-height overflow-y-auto" v-model="activeContactId">
    <ListItem
        v-for="contactId in displayList"
        :key="contactId"
        :k="contactId"
        class="pa-3 pl-6 chat-list-item text-left"
    >
      <template #prepend>
        <Avatar :contact-id="contactId"/>
      </template>
      <v-list-item-title>
        {{ getUser(contactId).name }}
      </v-list-item-title>
    </ListItem>
    <v-list-item>
      <span class="text-blue-grey-lighten-2" v-if="displayType === 'user'">
        {{
          userCount === 0 ? 'No friends yet' : userCount === 1 ? '1 friend in total' :
              userCount + ' friends in total'
        }}
      </span>
      <span class="text-blue-grey-lighten-2" v-if="displayType === 'group'">
        {{
          groupCount === 0 ? 'No friends yet' : groupCount === 1 ? '1 group in total' :
              groupCount + ' groups in total'
        }}
      </span>
    </v-list-item>
  </List>
</template>

<style scoped>
</style>
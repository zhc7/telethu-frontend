<script setup lang="ts">
import {computed} from 'vue';
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {activeContactId, cache, rawChatList} from "../globals.ts";
import {getAvatar} from "../core/data.ts";

const props = defineProps(["searchInput", "displayType"]);
const personContactList = computed(() => {
  return rawChatList.value
      .filter((i) => {
        return i.category === 'user';
      }).sort((a, b) => {
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
  return rawChatList.value
      .filter((i) => {
        return i.category === 'group';
      }).sort((a, b) => {
        if (a.id < 1) {
          return 1;
        }
        if (b.id < 1) {
          return -1;
        }
        return a.name.localeCompare(b.name);
      });
});
const userCount = computed(() => {
  let count = 0;
  rawChatList.value.forEach((entry) => {
    if (entry && entry.category === 'user') {
      count += 1;
    }
  })
  return count;
});
const groupCount = computed(() => {
  let count = 0;
  rawChatList.value.forEach((entry) => {
    if (entry && entry.category === 'group') {
      count += 1;
    }
  })
  return count;});

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
        v-for="contact in displayList"
        :key="contact.id"
        :k="contact.id"
        class="pa-3 pl-6 chat-list-item text-left"
    >
      <template #prepend>
        <v-avatar>
          <v-img :src="(() => {getAvatar(contact.avatar); return cache[contact.avatar] ? cache[contact.avatar] : '/Logo.png';})()" cover/>
        </v-avatar>
      </template>
      <v-list-item-title>
        {{ contact.name }}
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
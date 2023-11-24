<script setup lang="ts">
import {computed} from 'vue';
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {activeContactId, cache, rawChatList} from "../globals.ts";
import {getAvatarOrDefault} from "../core/data.ts";

const props = defineProps(["searchInput"]);
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
const userCount = computed(() => {
  let count = 0;
  rawChatList.value.forEach((entry) => {
    if (entry && entry.category === 'user') {
      count += 1;
    }
  })
  return count;
})

</script>

<template>
  <List class="fill-height overflow-y-auto" v-model="activeContactId">
    <ListItem :key="contact.id"
              :k="contact.id"
              class="pa-3 pl-6 chat-list-item text-left"
              v-for="contact in personContactList"
    >
      <template #prepend>
        <v-avatar>
          <v-img :src="getAvatarOrDefault(contact.avatar)" cover/>
        </v-avatar>
      </template>
      <v-list-item-title>
        {{ contact.name }}
      </v-list-item-title>
    </ListItem>
    <v-list-item>
      <span class="text-blue-grey-lighten-2">
        {{
          userCount === 0 ? 'No friends yet' : userCount === 1 ? '1 friend in total' :
              userCount + ' friends in total'
        }}
      </span>
    </v-list-item>
  </List>
</template>
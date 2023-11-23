<script setup>
import {computed} from 'vue';
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {activeChatId, users} from "../globals.ts";

const props = defineProps(["modelValue", "displayType", "searchInput"]);
const emit = defineEmits((["update:modelValue"]))
const personContacts = computed(() => {
  return Object.values(users.value)
      .sort((a, b) => (a.name.localeCompare(b.name)));
});

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

const displayContacts = computed(() => {
  let returnContacts = personContacts.value.filter((c) => (c.category === props.displayType));
  if (props.searchInput) {
    returnContacts = returnContacts.filter((c) => c.name.toLowerCase().includes(props.searchInput.toLowerCase()));
  }
  return returnContacts;
});

</script>

<template>
  <List class="fill-height overflow-y-auto" v-model="selected">
    <ListItem :key="contact.id"
              :k="contact.id"
              class="pa-3 pl-6 chat-list-item text-left"
              v-for="contact in displayContacts"
    >
      <template #prepend>
        <v-avatar>
          <v-img :src="contact.avatar" cover/>
        </v-avatar>
      </template>
      <v-list-item-title>
        {{ contact.name }}
      </v-list-item-title>
    </ListItem>
    <v-list-item>
      <span class="text-blue-grey-lighten-2">
        {{
          personContacts.filter((c) => (c.category === 'user')).length === 0 ? 'No friends yet' : personContacts.length === 1 ? '1 friend in total' :
              personContacts.length + ' friends in total'
        }}
      </span>
    </v-list-item>
  </List>
</template>
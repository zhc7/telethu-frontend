<script setup>
import {computed, defineProps} from 'vue';
import ListItem from "./ListItem.vue";
import List from "./List.vue";
import {contacts} from "../chat.js";

const props = defineProps(["modelValue"]);
const emit = defineEmits((["update:modelValue"]))
const personContacts = computed(() => {
  return Object.values(contacts.value)
      .sort((a, b) => (a.username.localeCompare(b.username)));
});

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  }
});

</script>

<template>
  <List class="fill-height" v-model="selected">
    <ListItem :key="contact.id"
              :k="contact.id"
              class="pa-3 pl-6 chat-list-item text-left"
              v-for="contact in personContacts"
    >
      <template #prepend>
        <v-avatar>
          <v-img src="/public/download.jpeg" contain/>
        </v-avatar>
      </template>
      <v-list-item-title>
        {{ contact.username }}
      </v-list-item-title>
    </ListItem>
    <v-list-item>
      <span class="text-blue-grey-lighten-2">
        {{ personContacts.length }} friends in total
      </span>
    </v-list-item>
  </List>
</template>
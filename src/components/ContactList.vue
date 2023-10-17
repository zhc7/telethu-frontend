<script setup>
import {computed, defineProps} from 'vue';
import ListItem from "./ListItem.vue";
import List from "./List.vue";

const props = defineProps(['contacts', "modelValue"]);
const emit = defineEmits((['select', "update:modelValue"]))
const personContacts = computed(() => {
  return props.contacts.filter((contact) => (contact.type === 'person')).sort((a, b) => (a.title > b.title));
});

const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    console.log("list", value);
  }
});

</script>

<template>
  <List class="fill-height" v-model="selected">
    <v-list-item class="bg-purple">
      <template #title>
        My Friends
      </template>
    </v-list-item>
    <div v-for="contact in personContacts">
      <ListItem :key="contact.id"
                :k="contact.id"
                align="left"
                class="pa-3 pl-6 chat-list-item"
                rounded="lg"
                color="primary"
      >
        <template #prepend>
          <v-avatar>
            <v-img src="/public/download.jpeg" contain/>
          </v-avatar>
        </template>
        <v-list-item-title v-text="contact.title">
        </v-list-item-title>
      </ListItem>
      <v-divider></v-divider>
    </div>
    <v-list-item>
      <span class="text-blue-grey-lighten-2">
        {{ personContacts.length }} friends in total
      </span>
    </v-list-item>
  </List>
</template>
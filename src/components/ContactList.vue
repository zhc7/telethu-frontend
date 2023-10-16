<script setup>
import {computed, defineProps} from 'vue';

const props = defineProps(['contacts']);
const emits = defineEmits((['select']))
const personContacts = computed(() => {
  return props.contacts.filter((contact) => (contact.type === 'person')).sort((a, b) => (a.title > b.title));
});
</script>

<template>
  <v-list class="fill-height">
    <v-list-item class="bg-purple">
      <template #title>
        My Friends
      </template>
    </v-list-item>
    <div v-for="contact in personContacts">
      <v-list-item :key="contact.id"
                   :value="contact.id"
                   @click="$emit('select', contact.id)"
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
      </v-list-item>
      <v-divider></v-divider>
    </div>
    <v-list-item>
      <span class="text-blue-grey-lighten-2">
        {{ personContacts.length }} friends in total
      </span>
    </v-list-item>
  </v-list>
</template>
<script setup>
import {defineProps, onMounted, computed} from 'vue';

const props = defineProps(['contactList']);

const personContacts = computed(() => {
  return props.contactList.filter((contact) => (contact.type === 'person'));
});
</script>

<template>
  <v-list class="fill-height">
    abcds
    <div v-for="contact in contactList">
      <v-list-item :key="chat.id"
                   :value="chat.id"
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
        <v-list-item-title v-text="chat.title">
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
    </div>
  </v-list>
</template>
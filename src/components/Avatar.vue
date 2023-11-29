<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {ContactsData} from "../utils/structs";
import {getUser} from "../core/data";
import {cache} from "../globals";
import axios from "axios";
import {token} from "../auth";
import {BASE_API_URL} from "../constants";

const props = defineProps<{
  contactId: number,
}>();

const contact = ref<ContactsData>();
const avatar = ref<string>();

const avatarUrl = (md5: string) => {
  if (md5.startsWith("http")) return md5;
  return BASE_API_URL + 'users/avatar/' + md5;
}

const getAvatar = async (hash: string): Promise<string> => {
  if (cache.value[hash]) return cache.value[hash];
  const url = avatarUrl(hash);
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: token.value,
      },
      responseType: "blob",
    });
    const reader = new FileReader();
    reader.readAsDataURL(response.data);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        cache.value[hash] = reader.result as string;
        resolve(cache.value[hash]);
      }
    });
  } catch (error) {
    console.log("error fetching", error);
    return '/Logo.png'
  }
}

onBeforeMount(async () => {
  if (props.contactId === 0) {
    contact.value = {
      id: 0,
      name: 'Loading...',
      avatar: '',
      category: 'user',
    }
    avatar.value = '/Logo.png';
    return;
  }
  contact.value = await getUser(props.contactId);
  avatar.value = await getAvatar(contact.value?.avatar);
})
</script>

<template>
  <v-avatar>
    <v-img v-if="contact === undefined" src="/Logo.png"/>
    <v-img
        v-else-if="contact.category === 'user'"
        lazy-src="/Logo.png"
        :src="avatar"
        :cover="true"
    />
    <v-icon v-else>mdi-account-multiple</v-icon>
  </v-avatar>
</template>

<style scoped>

</style>
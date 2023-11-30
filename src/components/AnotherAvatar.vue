<script setup lang="ts">
import {computed} from "vue";
import {BASE_API_URL} from "../constants.js";
import {cache} from "../globals.js";
import axios from "axios";
import {token} from "../auth.js";

const props = defineProps(['md5', 'isGroup']);

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

const avatar = computed(() => {
  getAvatar(props.md5);
  return cache.value[md5];
})

</script>

<template>
  <v-avatar>
    <v-img
        v-if="!isGroup"
        lazy-src="/Logo.png"
        :src="cache[md5]"
        :cover="true"
    />
    <v-icon v-else>mdi-account-multiple</v-icon>
  </v-avatar>
</template>
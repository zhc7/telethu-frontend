<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {getUser} from "../core/data";
import {bigImageSource, cache, showBigImage} from "../globals";
import axios from "axios";
import {token} from "../auth";
import {BASE_API_URL, DEBUG} from "../constants";

const props = withDefaults(defineProps<{
  displayBigAvatar?: boolean,
  contactId: number,
}>(), {
  displayBigAvatar: false
});

let contact = computed(() => getUser(props.contactId));
const avatar = ref<string>("/Logo.png");

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
    if (DEBUG) console.log("error fetching", error);
    return '/Logo.png'
  }
}

const handleClick = () => {
  if (!avatar.value) return;
  bigImageSource.value = avatar.value;
  if (props.displayBigAvatar) {
    showBigImage.value = true;
  }
}

watch(contact, () => {
  getAvatar(contact.value.avatar).then((result) => {
    avatar.value = result;
  });
}, {immediate: true});
</script>

<template>
  <v-avatar>
    <v-img
        @click="handleClick"
        v-if="contact.category === 'user'"
        lazy-src="/Logo.png"
        :src="avatar"
        :cover="true"
    />
    <v-icon v-else>mdi-account-multiple</v-icon>
  </v-avatar>
</template>

<style scoped>

</style>
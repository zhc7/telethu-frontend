<script setup>
import {token, userName, userId, userEmail} from "../auth.js";
import {useRouter} from "vue-router";
import {logout} from "../auth.js";

const router = useRouter();

const handleLogout = () => {
  logout();
  router.push('/login');
}
</script>

<template>
  <h1 class="ma-5">
    You are logged in as
  </h1>
  <v-divider/>
  <h2 class="ma-5">
    {{ userName }} | {{ userEmail }} # {{ userId }}
  </h2>
  <v-btn @click="handleLogout">Logout</v-btn>
</template>

<style scoped>

</style>
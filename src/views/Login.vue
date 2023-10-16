<script setup>
import signUp from "../components/SignUp.vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {login, register, user} from "../auth.js";
import {DEBUG} from "../const/constants.js";

const account = ref("");
const password = ref("");
const passwordVisible = ref(false);

const submit = () => {
  login(account.value, password.value)
      .then((message) => {
        console.log("received message: " + message)
        if (message === "") {
          router.push("/chat/0");
        } else {
          hint.value = "Wrong username or password"
        }
      })
};
</script>

<template>
  <v-container fluid class="login-page">
    <v-row class="fill-height">
      <!-- 左侧图标区域 -->
      <v-col
          md="6"
          lg="5"
          class="d-none d-sm-inline-block text-center align-self-center"
      >
        <!-- 替换下面的路径为你的图标路径 -->
        <img src="../assets/vue.svg" alt="Logo" style="max-width: 100%"/>
      </v-col>
      <v-col md="2" class="d-none d-lg-inline-block">
        <!-- 空内容或其他内容 -->
      </v-col>
      <!-- 右侧登录表单区域 -->
      <v-col
          cols="12"
          md="6"
          lg="5"
          class="align-self-center align-content-center"
      >
        <h1 class="mb-15">Welcome to TeleTHU!</h1>
        <v-text-field
          label="Account"
          v-model="account"
          prepend-icon="mdi-account"
          type="email"
          class="mb-3"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          label="Password"
          v-model="password"
          prepend-icon="mdi-lock"
          :type="passwordVisible ? 'text' : 'password'"
          :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="passwordVisible = !passwordVisible"
          variant="outlined"
          class="mb-7"
        ></v-text-field>

        <v-row>
          <v-col cols="6">
            <v-btn color="primary" class="login-btn" @click="submit"
            >Sign in
            </v-btn
            >
          </v-col>
          <v-col cols="6">
            <!-- Sign up dialog -->
            <signUp />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.ref-text {
  cursor: pointer;
}
.login-page {
  width: auto;
  margin: 0 auto;
  display: inline-block; /* 这将使元素的宽度由内容决定 */
}
</style>

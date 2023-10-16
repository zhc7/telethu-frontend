<script setup>
import signUp from "../components/SignUp.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {login, user} from "../auth.js";

const account = ref("");
const password = ref("");
const passwordVisible = ref(false);

const router = useRouter();
const hint = ref("");

if (user.value !== "") {
  router.push("/chat/0");
}

const submit = () => {
  login(account.value, password.value)
      .then((message) => {
        console.log("received message: " + message)
        if (message === "") {
          router.push("/chat/0");
        } else {
          hint.value = message;
        }
      })
};
</script>

<template>
  <v-container fluid>
    <v-row class="fill-height ml-10 mr-10">
      <!-- 左侧图标区域 -->
      <v-col
          cols="6"
          class="d-none d-sm-inline-block text-center align-self-center"
      >
        <!-- 替换下面的路径为你的图标路径 -->
        <img src="/public/vue.svg" alt="Logo" style="max-width: 100%"/>
      </v-col>
      <!-- 右侧登录表单区域 -->
      <v-col
          offset="1"
          cols="4"
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
            :error="hint !== ''"
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
            :error-messages="hint"
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
            <signUp/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  width: 100%;
  height: 100%;
}
</style>

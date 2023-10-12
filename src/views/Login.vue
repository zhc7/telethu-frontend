<script setup>
import {ref} from 'vue';
import {login} from '../auth.js';
import {useRouter} from 'vue-router';

const account = ref('');
const password = ref('');

const router = useRouter();

const submit = () => {
  login(account.value, password.value);
  router.push("/chat/0")
}

</script>

<template>
  <v-container fluid>
    <v-row class="fill-height">

      <!-- 左侧图标区域 -->
      <v-col md="6" lg="5" class="d-none d-sm-inline-block text-center align-self-center">
        <!-- 替换下面的路径为你的图标路径 -->
        <img src="../assets/vue.svg" alt="Logo" style="max-width: 100%;">
      </v-col>
      <v-col md="2" class="d-none d-lg-inline-block">
        <!-- 空内容或其他内容 -->
      </v-col>
      <!-- 右侧登录表单区域 -->
      <v-col cols="12" md="6" lg="5" class="align-self-center align-content-center">
        <h1 class="mb-15">Welcome to TeleTHU!</h1>
        <v-text-field
            label="Account"
            v-model="account"
            prepend-icon="mdi-account"
            type="email"
            class="mb-3"
        ></v-text-field>

        <v-text-field
            label="Password"
            v-model="password"
            prepend-icon="mdi-lock"
            type="password"
            class="mb-5"
        ></v-text-field>

        <v-row>
          <v-col cols="6">
            <v-btn color="primary" size="large" class="login-btn" @click="submit">登录</v-btn>  <!-- 登录按钮 -->
          </v-col>
          <v-col cols="6">
            <div class="flex-grow-1 text-right">
              <p>Didn't have an account?</p>
              <a href="/signup">Sign up right now!</a>  <!-- 注册链接 -->
            </div>
          </v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-container>
</template>


<style>
.login-btn {
  align-items: center;
}

</style>

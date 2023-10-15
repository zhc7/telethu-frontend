<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {login, register, user} from "../auth.js";
import {DEBUG} from "../const/constants.js";

const signupDialog = ref(null);
const account = ref("");
const password = ref("");
const confirmPassword = ref("");

const router = useRouter();
const hint = ref("");
const confirmPasswordError = ref("");

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
          hint.value = "Wrong username or password"
        }
      })
};

const dialog = ref(false);

const submitRegister = () => {
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Password not match";
    return;
  }
  register(account.value, password.value);
  dialog.value = false;
};
</script>

<template>
  <v-container class="pa-10">
    <v-row>
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
            :error="hint !== ''"
        ></v-text-field>

        <v-text-field
            label="Password"
            v-model="password"
            prepend-icon="mdi-lock"
            type="password"
            :error-messages="hint"
            class="mb-7"
        ></v-text-field>

        <v-row>
          <v-col cols="6">
            <v-btn color="primary" class="login-btn" @click="submit"
            >Sign in
            </v-btn
            >
            <!-- 登录按钮 -->
          </v-col>
          <v-col cols="6">
            <div class="flex-grow-1 text-right">
              <p>Didn't have an account?</p>
              <!-- Sign up dialog -->>
              <v-dialog v-model="dialog" persistent width="60vw">
                <template v-slot:activator="{ props }">
                  <a href="#" class="ref-text" v-bind="props">
                    Sign up right now!
                  </a>
                </template>
                <v-card>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <h2>Sign up</h2>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="Name*" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                              label="Account*"
                              v-model="account"
                              required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                              label="Password*"
                              v-model="password"
                              type="password"
                              required
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                              label="Confirm Password*"
                              v-model="confirmPassword"
                              type="password"
                              :error-messages="confirmPasswordError"
                              required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="dialog = false"
                    >
                      Close
                    </v-btn>
                    <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="submitRegister"
                    >
                      Sign up
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
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
</style>

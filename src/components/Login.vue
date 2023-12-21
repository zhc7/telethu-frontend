<script setup lang="ts">
import SignUp from "./SignUp.vue";
import ForgetPassword from "./ForgetPassword.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {login} from "../auth.ts";
import {DEBUG} from "../constants.ts";
import {userId} from "../globals.ts";

const account = ref("");
const password = ref("");
const passwordVisible = ref(false);

const router = useRouter();
const hint = ref("");

if (userId.value !== -1) {
  router.push("/");
}

const submit = () => {
  login(account.value, password.value)
      .then((message) => {
        if (DEBUG) console.log("received message: " + message);
        if (message === "") {
          router.push("/");
        } else {
          hint.value = message;
        }
      })
};
</script>

<template>
  <v-container fluid>
    <v-row class="fill-height ml-10 mr-10">
      <v-col
          cols="6"
          class="d-none d-sm-inline-block text-center align-self-center"
      >
        <img src="/Logo.png" alt="Logo" style="max-width: 100%"/>
      </v-col>
      <v-col
          offset="1"
          cols="12"
          sm="4"
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
            @keydown="(e: KeyboardEvent) => {if (e.key === 'Enter') submit()}"
            variant="outlined"
            class="mb-7"
            :error-messages="hint"
        ></v-text-field>

        <v-row>
          <v-col cols="4">
            <div class="d-flex justify-start">
              <v-btn
                  color="primary"
                  @click="submit"
                  size="large"
                  class="ml-10"
              >
                Sign in
              </v-btn>
            </div>
          </v-col>
          <v-col cols="8">
            <SignUp/>
            <ForgetPassword />
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

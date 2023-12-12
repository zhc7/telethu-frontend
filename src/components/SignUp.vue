<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {login, register} from "../auth.ts";
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import axios from "axios";
import {BASE_API_URL} from "../constants.ts";

defineEmits(["finished"])

const dialog = ref(false);
const signupName = ref("");
const signupAccount = ref("");
const signupPassword = ref("");
const confirmPassword = ref("");
const currentPage = ref(1);

const rules = {
  signupAccount: {required, email},
  signupPassword: {required}
}
const $v = useVuelidate(rules, {signupAccount, signupPassword});


const snackbar = ref(false);
const snackbarText = ref("");
const timeout = ref(2000);

const router = useRouter();

const submitRegister = async () => {
  if (signupPassword.value !== confirmPassword.value) {
    snackbarText.value = "Password not match!";
    snackbar.value = true;
    signupPassword.value = "";
    confirmPassword.value = "";
    return;
  }
  await register(signupName.value, signupAccount.value, signupPassword.value);
  await login(signupAccount.value, signupPassword.value);
  await router.push('/chat');
  dialog.value = false;
};

const next = async () => {
  if (currentPage.value === 1 && $v.value.signupAccount.$invalid) {
    snackbarText.value = "Invalid email!";
    snackbar.value = true;
    return;
  } else {
    const res = await axios.get(BASE_API_URL + 'users/email_exists/' + signupAccount.value);
    if (res.data === 'True') {
      snackbarText.value = "Email duplicated!";
      snackbar.value = true;
      return;
    }
    currentPage.value += 1;
  }
}
</script>

<template>
  <div class="flex-grow-1 text-right">
    <p>Didn't have an account?</p>

    <v-dialog v-model="dialog" persistent width="480">
      <template v-slot:activator="{ props }">
        <a href="#" class="ref-text" v-bind="props"> Sign up right now! </a>
      </template>

      <v-card>
        <div v-if="currentPage === 1">
          <v-card-title>
            <h3 class="ml-4 mt-4">Your email</h3>
          </v-card-title>
          <v-card-text>
            <v-text-field
                label="Account*"
                variant="outlined"
                v-model="signupAccount"
                color="primary"
                @blur="$v.signupAccount.$touch()"
                :error-messages="$v.signupAccount.$errors[0]? $v.signupAccount.$errors[0].$message : ''"
                required
                clearable
                class="ma-4"
            ></v-text-field>
            <p class="ml-4">Alert: This email will be used as your unique account.</p>
          </v-card-text>
        </div>

        <div v-if="currentPage === 2">
          <v-card-title>
            <h3 class="ml-4 mt-4">Your username</h3>
          </v-card-title>
          <v-card-text>
            <v-text-field
                label="Name*"
                variant="outlined"
                v-model="signupName"
                color="primary"
                @blur="$v.signupAccount.$touch()"
                required
                clearable
                class="ma-4"
            ></v-text-field>
            <p class="ml-4"></p>
          </v-card-text>
        </div>

        <v-card-text v-if="currentPage === 3">
          <v-container>
            <v-row>
              <v-col cols="12">
                <h2>Sign up</h2>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Name*"
                    variant="outlined"
                    v-model="signupName"
                    color="primary"
                    readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Account*"
                    variant="outlined"
                    v-model="signupAccount"
                    color="primary"
                    @blur="$v.signupAccount.$touch()"
                    readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Password*"
                    v-model="signupPassword"
                    type="password"
                    variant="outlined"
                    color="primary"
                    @blur="$v.signupPassword.$touch()"
                    :error-messages="$v.signupPassword.$errors[0]? $v.signupPassword.$errors[0].$message : ''"
                    required
                    clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Confirm Password*"
                    v-model="confirmPassword"
                    type="password"
                    variant="outlined"
                    color="primary"
                    required
                    clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="() => {dialog = false; currentPage = 1}">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="submitRegister" v-if="currentPage === 3">
            Sign up
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="next" v-if="currentPage !== 3">
            Next
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

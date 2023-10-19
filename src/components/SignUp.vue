<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {register} from "../auth.js";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

const dialog = ref(false);
const signupAccount = ref("");
const signupPassword = ref("");
const confirmPassword = ref("");

const rules = {
    signupAccount: { required, email },
    signupPassword: { required, minLength: minLength(8)}
}
const $v = useVuelidate(rules, { signupAccount, signupPassword });


const snackbar = ref(false);
const snackbarText = ref("");
const timeout = ref(2000);

const router = useRouter();

const submitRegister = () => {
  if (signupPassword.value !== confirmPassword.value) {
    snackbarText.value = "Password not match!";
    snackbar.value = true;
    signupPassword.value = "";
    confirmPassword.value = "";
    return;
  }
  register(signupAccount.value, signupPassword.value);
  dialog.value = false;
};
</script>

<template>
  <div class="flex-grow-1 text-right">
    <p>Didn't have an account?</p>

    <v-dialog v-model="dialog" persistent width="480">
      <template v-slot:activator="{ props }">
        <a href="#" class="ref-text" v-bind="props"> Sign up right now! </a>
      </template>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <h2>Sign up</h2>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Name*"
                  variant="outlined"
                  color="primary"
                  required
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Account*"
                  variant="outlined"
                  v-model="signupAccount"
                  color="primary"
                  @blur="$v.signupAccount.$touch()"
                  :error-messages="$v.signupAccount.$errors[0]? $v.signupAccount.$errors[0].$message : ''"
                  required
                  clearable
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
                  label="Confirm Possword*"
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
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="submitRegister">
            Sign up
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

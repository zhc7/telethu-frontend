<script setup lang="ts">
import {ref} from "vue";
import {getVerifyCode, token} from "../auth.ts";
import {callSnackbar} from "../utils/snackbar.ts";
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "../constants.ts";
import {stringMd5} from "../utils/hash.ts";
import {editProfile} from "../core/users/profile.ts";

const emit = defineEmits(['update:showDialog']);

const changeEmailDialogPage = ref(1);
const verifyPassword = ref("");
const newEmail = ref("");
const verifyCode = ref("");
const countdown = ref(0);
const applyForVerifyCode = () => {
  getVerifyCode(newEmail.value).then(() => {
    changeEmailDialogPage.value += 1;
    callSnackbar("Verify code sent!", "green");
  }).catch((error) => {
    callSnackbar("Failed sending verify code: " + error.response.data.info, "red");
  });
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value === 0) {
      clearInterval(timer);
    }
  }, 1000);
}
const cancelChangeEmail = () => {
  changeEmailDialogPage.value = 1;
  verifyPassword.value = "";
  newEmail.value = "";
  verifyCode.value = "";
  emit('update:showDialog', false);
}
const $v = useVuelidate({
  newEmail: {required, email},
}, {newEmail});
const changeEmailDialogNext = async () => {
  if (changeEmailDialogPage.value === 1) {
    if ($v.value.newEmail.$invalid) {
      callSnackbar("Invalid email!", "red");
      return;
    }
    const res = await axios.get(BASE_API_URL + 'users/email_exists/' + newEmail.value);
    if (res.data === 'True') {
      callSnackbar("Email already exists!", "red");
      return;
    }
    const email = newEmail.value;
    try {
      await axios.post(BASE_API_URL + 'users/receive_code', {
        userEmail: email,
      }, {
        headers: {
          Authorization: token.value
        }
      });
    } catch(e) {
      callSnackbar(e.response.data.info, 'red');
      return;
    }
    changeEmailDialogPage.value += 1;
  } else if (changeEmailDialogPage.value === 2) {
    const password = stringMd5(verifyPassword.value);
    const email = newEmail.value;
    try {
      await editProfile({
        password,
        verification_code: verifyCode.value,
        email,
      });
    } catch(e) {
      if (DEBUG) console.log(e);
      callSnackbar(e.response.data.info, 'red');
      return;
    }
    emit('update:showDialog', false);
    setTimeout(() => {
      changeEmailDialogPage.value = 1;
    }, 150);
  }
}

</script>

<template>
  <v-dialog persistent width="480">
    <v-card>
      <div v-if="changeEmailDialogPage === 1">
        <v-card-title>
          <h3 class="ml-4 mt-4">New email</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="Account*"
              variant="outlined"
              v-model="newEmail"
              color="primary"
              @blur="$v.newEmail.$touch()"
              :error-messages="$v.newEmail.$errors[0]? $v.newEmail.$errors[0].$message : ''"
              required
              clearable
              class="ma-4"
          ></v-text-field>
        </v-card-text>
      </div>
      <v-card-text v-if="changeEmailDialogPage === 2">
        <v-card-title>
          <h3 class="ml-4 mt-4">Your password</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field
              label="Password*"
              v-model="verifyPassword"
              type="password"
              variant="outlined"
              color="primary"
              required
              clearable
              class="ma-4"
          ></v-text-field>
          <p class="ml-4">Enter your password.</p>
        </v-card-text>
        <v-card-title>
          <h3 class="ml-4 mt-4">Verify Your Account</h3>
        </v-card-title>
        <v-card-text>
          <p class="ml-4">We sent a verification code to {{ newEmail }} <br>
            Please check your email and paste the code below.</p>
          <v-otp-input
              v-model="verifyCode"
              type="password"
              variant="solo"
              class="ma-4"
              :input-length="6"
          ></v-otp-input>
          <div class="ml-4">
            <p>Didn't receive the code?</p>
            <a href="#" v-if="countdown === 0" @click.prevent="applyForVerifyCode">Resend</a>
            <span v-else>Resend available in {{ countdown }} seconds</span>
          </div>
        </v-card-text>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" @click="cancelChangeEmail">Cancel</v-btn>
        <v-btn color="info" v-if="changeEmailDialogPage < 2" @click="changeEmailDialogNext">Next</v-btn>
        <v-btn color="info" v-if="changeEmailDialogPage === 2" @click="changeEmailDialogNext">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
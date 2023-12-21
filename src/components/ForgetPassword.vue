<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {getVerifyCode, login, token} from "../auth.ts";
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "../constants.ts";
import {callSnackbar} from "../utils/snackbar.ts";
import {stringMd5} from "../utils/hash.ts";
import {snackbar} from "../globals.ts";


const dialog = ref(false);
const newPassword = ref("");
const signupAccount = ref("");
const confirmPassword = ref("");
const currentPage = ref(1); // 1. email 2. verify code + new password
const verifyCode = ref("");
const countdown = ref(0);

const rules = {
  signupAccount: {required, email},
  signupPassword: {required}
}
const $v = useVuelidate(rules, {signupAccount, signupPassword: newPassword});

const router = useRouter();

const loginDirectly = async () => {
  await login(signupAccount.value, confirmPassword.value);
  await router.push('/chat');
  dialog.value = false;
}

const next = async () => {
  if (currentPage.value === 1) {
    if ($v.value.signupAccount.$invalid) {
      callSnackbar("Invalid email!", "red");
      return;
    }
    const res = await axios.get(BASE_API_URL + 'users/email_exists/' + signupAccount.value);
    if (res.data === 'False') {
      callSnackbar("Account doesn't exist", "red");
      return;
    }
    await applyForVerifyCode();
    currentPage.value += 1;
  } else if (currentPage.value === 2) {
    if (newPassword.value !== confirmPassword.value || newPassword.value === "") {
      callSnackbar("Password doesn't match!", "red");
      newPassword.value = "";
      confirmPassword.value = "";
      return;
    }
    try {
      const result = await axios.post(BASE_API_URL + 'users/login_with_email', {
        userEmail: signupAccount.value,
        new_password: stringMd5(confirmPassword.value),
        verification_code: verifyCode.value,
      })
      if (DEBUG) console.log(JSON.stringify(result.data));
    } catch(e) {
      callSnackbar('Wrong code', 'red');
      return;
    }
    currentPage.value += 1;
  }
}

const applyForVerifyCode = () => {
  getVerifyCode(signupAccount.value).then(() => {
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

// if enter is pressed, next or submit
const keydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    next();
  }
}

const cancel = () => {
  dialog.value = false;
  currentPage.value = 1;
  signupAccount.value = "";
  signupName.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  $v.value.signupAccount.$reset();
}
</script>

<template>
  <div class="flex-grow-1 text-right">

    <v-dialog v-model="dialog" persistent width="480" @keydown="keydown">
      <template v-slot:activator="{ props }">
        <a href="#" class="ref-text" v-bind="props"> Forget password </a>
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
                autofocus
                class="ma-4"
            ></v-text-field>
          </v-card-text>
        </div>
        <v-card-text v-if="currentPage === 2">
          <v-container>
            <v-row>
              <v-col cols="12">
                <h2>Set Password</h2>
              </v-col>
              <v-col cols="12">
                <v-text-field
                    label="Password*"
                    v-model="newPassword"
                    type="password"
                    variant="outlined"
                    color="primary"
                    @blur="$v.signupPassword.$touch()"
                    :error-messages="$v.signupPassword.$errors[0]? $v.signupPassword.$errors[0].$message : ''"
                    required
                    clearable
                    autofocus
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
            <v-card-title>
              <h3 class="ml-4 mt-4">Verify Your Account</h3>
            </v-card-title>
            <v-card-text>
              <p class="ml-4">We sent a verification code to {{ signupAccount }} <br>
                Please check your email and paste the code below.</p>
              <v-otp-input
                  v-model="verifyCode"
                  variant="solo"
                  class="ma-4"
                  :input-length="6"
              ></v-otp-input>
              <div class="ml-4">
                <p>Didn't receive the code?</p>
                <a href="#" v-if="countdown <= 0" @click.prevent="applyForVerifyCode">Resend</a>
                <span v-else>Resend available in {{ countdown }} seconds</span>
              </div>
            </v-card-text>
          </v-container>
        </v-card-text>
        <v-card-text v-if="currentPage === 3" class="text-center">
          <h2 class="ma-5 animated-text">Congratulations!</h2>
          <p class="animated-text">Password reset!</p>
          <div class="emoji">🎉</div>
          <v-btn
              class="animated-button"
              variant="flat"
              color="primary"
              width="50%"
              height="40"
              @click="loginDirectly"
          >Login right now
          </v-btn>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="cancel">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="currentPage -= 1"
                 v-if="currentPage < 5  && currentPage > 1">
            Back
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="next" v-if="currentPage < 4">
            Next
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="submitRegister" v-if="currentPage === 4">
            Verify
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>

.animated-text {
  animation: fadeIn 2s;
}

.animated-button {
  animation: popIn 2s;
}

.emoji {
  font-size: 48px; /* 调整 emoji 的大小 */
  display: block;
  margin: 20px auto; /* 垂直居中显示 */
  animation: coolEffect 3s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes popIn {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes coolEffect {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.5) rotate(20deg);
  }
  50% {
    transform: scale(1.2) rotate(-20deg);
  }
  75% {
    transform: scale(1.3) rotate(10deg);
  }
}


</style>
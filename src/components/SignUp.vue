<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {getVerifyCode, login, register} from "../auth.ts";
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";
import axios from "axios";
import {BASE_API_URL} from "../constants.ts";
import {callSnackbar} from "../utils/snackbar.ts";

defineEmits(["finished"])

const dialog = ref(false);
const signupName = ref("");
const signupAccount = ref("");
const signupPassword = ref("");
const confirmPassword = ref("");
const currentPage = ref(1); // 1. email 2. name 3. password 4. verify code 5. success
const verifyCode = ref("");
const countdown = ref(0);

const rules = {
  signupAccount: {required, email},
  signupPassword: {required}
}
const $v = useVuelidate(rules, {signupAccount, signupPassword});

const router = useRouter();

const submitRegister = async () => {
  await register(signupName.value, signupAccount.value, signupPassword.value, verifyCode.value).then(() => {
    currentPage.value += 1;
  }).catch((error) => {
    callSnackbar(error, "red");
  });
};

const loginDirectly = async () => {
  await login(signupAccount.value, signupPassword.value);
  await router.push('/chat');
  dialog.value = false;
}

const next = async () => {
  if (currentPage.value === 1) {
    if ($v.value.signupAccount.$invalid) {
      callSnackbar("Invalid email!", "red");
      return;
    } else {
      const res = await axios.get(BASE_API_URL + 'users/email_exists/' + signupAccount.value);
      if (res.data === 'True') {
        callSnackbar("Email already exists!", "red");
        return;
      }
    }
    currentPage.value += 1;
  } else if (currentPage.value === 2) {
    if (signupName.value === "") {
      signupName.value = signupAccount.value.split('@')[0];
    }
    currentPage.value += 1;
  } else if (currentPage.value === 3) {
    if (signupPassword.value !== confirmPassword.value || signupPassword.value === "") {
      callSnackbar("Password not match!", "red");
      signupPassword.value = "";
      confirmPassword.value = "";
      return;
    }
    applyForVerifyCode();
  }
}

const applyForVerifyCode = () => {
  getVerifyCode(signupAccount.value).then(() => {
    currentPage.value += 1;
    callSnackbar("Verify code sent!", "green");
  }).catch((error) => {
    callSnackbar("Failed sending verify code: " + error, "red");
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
    if (currentPage.value === 4) {
      submitRegister();
    } else {
      next();
    }
  }
}

const cancel = () => {
  dialog.value = false;
  currentPage.value = 1;
  signupAccount.value = "";
  signupName.value = "";
  signupPassword.value = "";
  confirmPassword.value = "";
  $v.value.signupAccount.$reset();
}
</script>

<template>
  <div class="flex-grow-1 text-right">
    <p>Didn't have an account?</p>

    <v-dialog v-model="dialog" persistent width="480" @keydown="keydown">
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
            <p class="ml-4">You can change your username anytime.</p>
          </v-card-text>
        </div>

        <v-card-text v-if="currentPage === 3">
          <v-container>
            <v-row>
              <v-col cols="12">
                <h2>Set Password</h2>
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

        <v-card-text v-if="currentPage === 4">
          <v-card-title>
            <h3 class="ml-4 mt-4">Verify Your Account</h3>
          </v-card-title>
          <v-card-text>
            <p class="ml-4">We sent a verification code to {{ signupAccount }} <br>
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

        <v-card-text v-if="currentPage === 5" class="text-center">
          <h2 class="ma-5 animated-text">Congratulations!</h2>
          <p class="animated-text">You have successfully registered an account.</p>
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
          <v-btn color="blue-darken-1" variant="text" @click="currentPage -= 1" v-if="currentPage < 5  && currentPage > 1">
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
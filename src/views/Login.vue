<script setup>
import {ref} from 'vue';
import {login, register} from '../auth.js';
import {useRouter} from 'vue-router';
import {DEBUG} from '../const/constants.js'

const signupDialog = ref(null);
const account = ref('');
const password = ref('');

const router = useRouter();

const submit = () => {
  login(account.value, password.value);
  router.push("/chat/0")
}

const dialog = ref(false);

const submitRegister = () => {
  register(account.value, password.value);
  dialog.value = false
}

const showSignUpDialog = () => {
  signupDialog.value.open();
};
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
            <v-btn color="primary" class="login-btn" @click="submit">登录</v-btn> <!-- 登录按钮 -->
          </v-col>
          <v-col cols="6">
            <div class="flex-grow-1 text-right">
              <p>Didn't have an account?</p>
              <!-- Sign up dialog -->>
              <v-dialog v-model="dialog" persistent width="1024">
                <template v-slot:activator="{ props }">
                  <a href="#" class="ref-text" v-bind="props">
                    Sign up right now!
                  </a>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">User Profile</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="First name*" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field label="Last name*"
                                        hint="example of persistent helper text" persistent-hint
                                        required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field label="Account*" v-model="account"  required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field label="Password*" v-model="password" type="password" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*"
                                    required></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-autocomplete
                              :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                              label="Interests" multiple></v-autocomplete>
                        </v-col>
                      </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                      Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="submitRegister">
                      Save
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

  <SignUp ref="signupDialog"/>
</template>


<style>
.login-btn {
  width: 88px;
  height: 49.5px !important;
  margin-right: 40px;
  align-items: center;
}

.ref-text {
  color: primary;
  cursor: pointer;
}
</style>

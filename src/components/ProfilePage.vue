<script setup lang="ts">
import {getVerifyCode, logout, token} from "../auth.ts";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "../constants.ts";
import {blacklist, settings, user, userEmail, userId} from "../globals.ts";
import SelectMember from "./SelectMember.vue";
import {editProfile} from "../core/users/profile.ts";
import {unblockFriend} from "../core/users/send.ts";
import {callSnackbar} from "../utils/snackbar.ts";
import {useVuelidate} from "@vuelidate/core";
import {email, required} from "@vuelidate/validators";

const router = useRouter();

const fileInput = ref<HTMLElement | null>(null);
const triggerFileInput = () => {
  fileInput.value!.click();
};

const handleUploadAvatar = (event: any) => {
  if (DEBUG) console.log(event);
  const avatar = event.target.files[0];
  avatar.url = URL.createObjectURL(avatar);
  axios.post(BASE_API_URL + 'users/avatar/', avatar, {
    headers: {
      "Content-Type": avatar.type,
      Authorization: token.value,
    }
  }).then((response) => {
    if (DEBUG) console.log("HTTP upload avatar successful -> ", response);
  }).then(() => {
    axios.get(BASE_API_URL + 'users/avatar', {
      headers: {
        Authorization: token.value,
      },
      responseType: 'blob',
    }).then((response) => {
          if (DEBUG) console.log('userAvatar: ', response.data);
          const reader = new FileReader();
          reader.readAsDataURL(response.data); // change Blob into Base64
          reader.onloadend = () => {
            user.value.avatar = reader.result as string;
          }
        }
    )
  }).catch((error) => {
    if (DEBUG) console.log(error);
  })
};

const handleLogout = () => {
  if (confirm('Are you sure?')) {
    logout();
    router.push('/login');
  }
}

onMounted(async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}users/avatar`, {
      headers: {
        Authorization: token.value,
      },
      responseType: 'blob',
    });
    const reader = new FileReader();
    reader.readAsDataURL(response.data); // change Blob into Base64
    reader.onloadend = () => {
      user.value.avatar = reader.result as string;
    };
  } catch (error) {
    console.error('Http get avatar failed -> ', error);
  }
});

const displayEditEntry = ref<string | undefined>(undefined);
const editingEntry = ref<string | undefined>(undefined);

const inputValue = ref('');
const oldPassword=  ref('');
const newPassword1 = ref('');
const newPassword2 = ref('');
const handleChangePassword = () => {
  if (newPassword1.value !== newPassword2.value) {
    alert('Wrong confirmation');
  } else {
    editProfile({
      old_password: oldPassword.value,
      new_password: newPassword1.value,
    }, true);
  }
  changePasswordDialog.value = false;
}
const dialog = computed(() => {
  return editingEntry.value !== undefined;
});

const changeEmailDialog = ref(false);
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
const cancelChangeEmail = () => {
  changeEmailDialogPage.value = 1;
  changeEmailDialog.value = false;
  verifyPassword.value = "";
  newEmail.value = "";
  verifyCode.value = "";
}
const $v = useVuelidate({
  newEmail: {required, email},
}, {newEmail});
const changeEmailDialogNext = async () => {
  if (changeEmailDialogPage.value === 1) {
    const password = verifyPassword.value;
    axios.post(BASE_API_URL + "users/login", {userEmail: user.value.email, password}).then(() => {
      changeEmailDialogPage.value += 1;
    }).catch(() => {
      callSnackbar("Wrong password!", "red");
    });
  } else if (changeEmailDialogPage.value === 2) {
    if ($v.value.newEmail.$invalid) {
      callSnackbar("Invalid email!", "red");
      return;
    } else {
      const res = await axios.get(BASE_API_URL + 'users/email_exists/' + newEmail.value);
      if (res.data === 'True') {
        callSnackbar("Email already exists!", "red");
        return;
      }
    }
    changeEmailDialogPage.value += 1;
  } else if (changeEmailDialogPage.value === 3) {
    changeEmailDialogPage.value += 1;
  }
}
const handleChangeEmail = () => {
  axios.post(BASE_API_URL + "users/change_email", {
    oldEmail: user.value.email,
    newEmail: newEmail.value,
    verifyCode: verifyCode.value,
  }).then(() => {
    user.value.email = newEmail.value;
    userEmail.value = newEmail.value;
    callSnackbar("Email changed!", "green");
    cancelChangeEmail();
  }).catch((error) => {
    callSnackbar("Failed changing email: " + error, "red");
  });
}

const editingTitle = computed(() => {
  if (editingEntry.value === 'username') {
    return 'Edit your user name';
  } else if (editingEntry.value === 'location') {
    return 'Change location';
  } else if (editingEntry.value === 'phone') {
    return 'Change phone number';
  }
  return '';
})

const handleConfirm = () => {
  const newProfile: {
    name?: string,
    email?: string,
    location?: string,
    phone?: string
  } = {};
  let http = false;
  if (editingEntry.value === 'username') {
    http = true;
    newProfile.name = inputValue.value;
    if (DEBUG) console.log('changing username to ' + inputValue.value);
  }
  if (editingEntry.value === 'email') {
    http = true;
    newProfile.email = inputValue.value;
    if (DEBUG) console.log('changing email to ' + inputValue.value);
  }
  if (editingEntry.value === 'phone') {
    settings.value.phone = inputValue.value;
  }
  if (editingEntry.value === 'location') {
    settings.value.location = inputValue.value;
  }
  editingEntry.value = undefined;
  editProfile(newProfile, http);
}

const blackListDialog = ref(false);
const changePasswordDialog = ref(false);



</script>

<template>
  <v-row no-gutters>
    <v-dialog v-model="dialog" max-width="20vw" max-height="80vh">
      <v-card class="fill-height overflow-y-auto">
        <v-card-title>{{ editingTitle }}</v-card-title>
        <v-card-text>
          <v-text-field autofocus v-model="inputValue" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions class="mb-3 mr-4">
          <v-spacer></v-spacer>
          <v-btn color="info" @click="handleConfirm">Confirm</v-btn>
          <v-btn color="error" @click="editingEntry=undefined">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col cols="8" offset="2">
      <v-card class="mb-auto mt-6">
        <v-avatar size="80" class="mt-5">
          <v-img :src="user.avatar" cover/>
        </v-avatar>
        <v-card-item>
          <v-row no-gutters pa="4">
            <v-col cols="8" offset="2">
              <v-list>
                <v-list-item-title @mouseover="displayEditEntry='username'"
                                   @mouseleave="displayEditEntry=undefined">
                  <v-icon size="xs"></v-icon>
                  <span>{{ user.name }}</span>
                  <v-icon v-if="displayEditEntry==='username'" size="xs"
                          @click="editingEntry='username'; inputValue=user.name">
                    mdi-grease-pencil
                  </v-icon>
                  <v-icon v-else size="xs"></v-icon>
                </v-list-item-title>
                <v-list-item-subtitle>
                  @{{ userId }}
                </v-list-item-subtitle>
                <v-divider class="ma-4"/>
                <v-list-item class="text-grey-darken-3 pa-4">
                  <v-row pa="2" @mouseover="displayEditEntry='location'" @mouseleave="displayEditEntry=undefined">
                    <v-col cols="4" offset="1" class="text-right">
                      Location:
                    </v-col>
                    <v-col cols="6" class="text-left">
                      <span>{{ settings.location ? settings.location : 'to be determined' }}</span>
                      <v-icon v-if="displayEditEntry==='location'" size="xs"
                              @click="editingEntry='location'; inputValue=(settings.location ? settings.location : '')">
                        mdi-grease-pencil
                      </v-icon>
                      <v-icon v-else></v-icon>
                    </v-col>
                  </v-row>
                  <v-row pa="2" @mouseover="displayEditEntry='phone'" @mouseleave="displayEditEntry=undefined">
                    <v-col cols="4" offset="1" class="text-right">
                      Phone:
                    </v-col>
                    <v-col cols="6" class="text-left">
                      <span>{{ settings.phone ? settings.phone : 'to be determined' }}</span>
                      <v-icon v-if="displayEditEntry==='phone'" size="xs"
                              @click="editingEntry='phone'; inputValue=(settings.phone ? settings.phone : '')">
                        mdi-grease-pencil
                      </v-icon>
                      <v-icon v-else></v-icon>
                    </v-col>
                  </v-row>
                  <v-row pa="2" @mouseover="displayEditEntry='email'" @mouseleave="displayEditEntry=undefined">
                    <v-col cols="4" offset="1" class="text-right">
                      Email:
                    </v-col>
                    <v-col cols="6" class="text-left mb-3">
                      <span>
                        {{ user.email }}
                      </span>
                      <v-icon v-if="displayEditEntry==='email'" size="xs"
                              @click="changeEmailDialog = true">
                        mdi-grease-pencil
                      </v-icon>
                      <v-icon v-else></v-icon>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-divider class="ma-4"/>
          <v-card-actions class="justify-center">
            <v-btn-group color="info" variant="outlined" divided>
              <v-btn @click="handleLogout">LOGOUT</v-btn>
              <v-btn @click="triggerFileInput">UPLOAD AVATAR</v-btn>
              <v-btn @click="blackListDialog=true">BLACK LIST</v-btn>
              <v-btn @click="changePasswordDialog=true">CHANGE PASSWORD</v-btn>

            </v-btn-group>
            <input
                type="file"
                ref="fileInput"
                @change="handleUploadAvatar"
                style="display: none;"
            />
          </v-card-actions>
        </v-card-item>
      </v-card>
    </v-col>
    <SelectMember
        v-model:show-dialog="blackListDialog"
        :pinned="[]"
        :title="`${user.name}'s Black List`"
        :possible="blacklist"
        :single="true"
        @confirm="(target, _) => {
          settings.blocked = settings.blocked.filter(id => id !== target.value.id);
          unblockFriend(target);
        }"
    />
    <v-dialog v-model="changePasswordDialog" max-width="20vw" max-height="80vh">
      <v-card class="fill-height overflow-y-auto">
        <v-card-title>Change Password</v-card-title>
        <v-card-text>
          <v-label>Old Password</v-label>
          <v-text-field autofocus v-model="oldPassword" variant="outlined" type="password"></v-text-field>
          <v-label>New Password</v-label>
          <v-text-field v-model="newPassword1" variant="outlined" type="password"></v-text-field>
          <v-label>Confirmation</v-label>
          <v-text-field v-model="newPassword2" variant="outlined" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions class="mb-3 mr-4">
          <v-spacer></v-spacer>
          <v-btn color="info" @click="handleChangePassword">Confirm</v-btn>
          <v-btn color="error" @click="changePasswordDialog=false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="changeEmailDialog" persistent width="480">
      <v-card>
        <div v-if="changeEmailDialogPage === 1">
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
        </div>
        <div v-if="changeEmailDialogPage === 2">
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
        <v-card-text v-if="changeEmailDialogPage === 3">
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
          <v-btn color="info" v-if="changeEmailDialogPage < 3" @click="changeEmailDialogNext">Next</v-btn>
          <v-btn color="info" v-if="changeEmailDialogPage === 3" @click="handleChangeEmail">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>

</style>
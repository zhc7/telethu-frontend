<script setup lang="ts">
import {logout, token} from "../auth.ts";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {BASE_API_URL, DEBUG} from "../constants.ts";
import {blacklist, settings, user} from "../globals.ts";
import SelectMember from "./SelectMember.vue";
import {editProfile} from "../core/users/profile.ts";
import {unblockFriend} from "../core/users/send.ts";
import {callSnackbar} from "../utils/snackbar.ts";
import ChangeEmailDialog from "./ChangeEmailDialog.vue";
import DeleteAccountDialog from "./DeleteAccountDialog.vue";
import Avatar from "./Avatar.vue";
import {stringMd5} from "../utils/hash.ts";
import {getUser} from "../core/data.ts";

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
    callSnackbar('Avatar uploaded!', 'green');
  }).then(() => {
    getUser(user.value.id, true);
  }).catch((error) => {
    if (DEBUG) console.log(error);
    callSnackbar('Failed uploading avatar: ' + error.response.data.info, 'red');
  })
};

const handleLogout = () => {
  if (confirm('Are you sure?')) {
    router.push('/login');
    logout();
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
const oldPassword = ref('');
const newPassword1 = ref('');
const newPassword2 = ref('');
const cancel = () => {
  editingEntry.value = undefined;
  inputValue.value = '';
  oldPassword.value = '';
  newPassword1.value = '';
  newPassword2.value = '';
  changePasswordDialog.value = false;
}
const handleChangePassword = () => {
  if (newPassword1.value !== newPassword2.value) {
    callSnackbar('Password not match!', 'red')
  } else {
    editProfile({
      old_password: stringMd5(oldPassword.value),
      new_password: stringMd5(newPassword1.value),
    }, true).then(() => {
      callSnackbar('Password changed!', 'green');
      cancel();
    }).catch((error) => {
      callSnackbar('Failed changing password: ' + error.response.data.info, 'red');
    });
  }
}
const dialog = computed(() => {
  return editingEntry.value !== undefined;
});

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
const changeEmailDialog = ref(false);
const deleteAccountDialog = ref(false);
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
          <v-btn color="error" @click="editingEntry=undefined">Cancel</v-btn>
          <v-btn color="info" @click="handleConfirm">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col cols="8" offset="2">
      <v-card class="mb-auto mt-6">
        <Avatar class="mt-2" :contact-id="user.id" display-big-avatar/>
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
                  @{{ user.id }}
                </v-list-item-subtitle>
                <v-divider class="ma-4"/>
                <v-list-item class="text-grey-darken-3 pa-4">
                  <v-row pa="2" @mouseover="displayEditEntry='location'" @mouseleave="displayEditEntry=undefined">
                    <v-col cols="4" offset="1" class="text-right">
                      Location:
                    </v-col>
                    <v-col cols="6" class="text-left">
                      <span>{{ settings.location ? settings.location : 'hover to set' }}</span>
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
                      <span>{{ settings.phone ? settings.phone : 'hover to set' }}</span>
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
            <v-row>
              <v-col cols="12">
                <v-btn-group color="info" variant="outlined" divided>
                  <v-btn @click="handleLogout">LOGOUT</v-btn>
                  <v-btn @click="triggerFileInput">UPLOAD AVATAR</v-btn>
                  <v-btn @click="blackListDialog=true">BLACK LIST</v-btn>
                </v-btn-group>
              </v-col>
              <v-col cols="12">
                <v-btn-group color="info" variant="outlined" divided>
                  <v-btn @click="changePasswordDialog=true">CHANGE PASSWORD</v-btn>
                  <v-btn @click="deleteAccountDialog=true">DELETE ACCOUNT</v-btn>
                </v-btn-group>
              </v-col>
            </v-row>
            <input
                type="file"
                ref="fileInput"
                @change="handleUploadAvatar"
                style="display: none"
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
          unblockFriend(target);
        }"
    />
    <v-dialog v-model="changePasswordDialog" max-width="20vw" max-height="80vh">
      <v-card class="fill-height overflow-y-auto">
        <v-card-title>Change Password</v-card-title>
        <v-card-text>
          <v-label>Old Password</v-label>
          <v-text-field v-model="oldPassword" variant="outlined" type="password"></v-text-field>
          <v-label>New Password</v-label>
          <v-text-field v-model="newPassword1" variant="outlined" type="password"></v-text-field>
          <v-label>Confirmation</v-label>
          <v-text-field v-model="newPassword2" variant="outlined" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions class="mb-3 mr-4">
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cancel">Cancel</v-btn>
          <v-btn color="info" @click="handleChangePassword">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ChangeEmailDialog v-model="changeEmailDialog" @update:showDialog="() => {changeEmailDialog = false}"/>
    <DeleteAccountDialog v-model="deleteAccountDialog" @update:showDialog="() => {deleteAccountDialog = false}"/>
  </v-row>
</template>

<style scoped>

</style>
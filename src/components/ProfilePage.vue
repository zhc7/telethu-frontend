<script setup>
import {logout, token} from "../auth.ts";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getFileType, uploadFiles} from "../core/files.ts";
import {sendFiles} from "../core/chat.ts";
import axios from "axios";
import {BASE_API_URL} from "../constants.ts";
import {user, userEmail, userId, userName} from "../globals.ts";

const router = useRouter();

const editingMode = ref(false);
const phoneNumberInput = ref('');
const emailInput = ref('');

const fileInput = ref(null);
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleUploadAvatar = (event) => {
  console.log(event);
  const avatar = event.target.files[0];
  avatar.url = URL.createObjectURL(avatar);
  axios.post(BASE_API_URL + 'users/avatar/', avatar, {
    headers: {
      "Content-Type": avatar.type,
      Authorization: token.value,
    }
  }).then((response) => {
    console.log("HTTP upload avatar successful -> ", response);
  }).catch((error) => {
    console.log(error);
  })
};

const handleLogout = () => {
  if (confirm('Are you sure?')) {
    logout();
    router.push('/login');
  }
}

const handleEdit = () => {
  editingMode.value = true;
  phoneNumberInput.value = '114514';
  emailInput.value = 'donkey@bohan.cn';
}

onMounted(async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}users/avatar/`, {
      headers: {
        Authorization: token.value,
      },
      responseType: 'blob',
    });
    const reader = new FileReader();
    reader.readAsDataURL(response.data); // change Blob into Base64
    reader.onloadend = function() {
      user.value.avatar = reader.result;
    };
  } catch (error) {
    console.error('Http get avatar failed -> ', error);
  }
});
</script>

<template>
  <v-row no-gutters>
    <v-col cols="8" offset="2">
      <v-card class="mb-auto mt-6">
        <v-avatar size="80" class="mt-5">
          <v-img :src="user.avatar" cover/>
        </v-avatar>
        <v-card-item>
          <v-row no-gutters pa="4">
            <v-col cols="8" offset="2">
              <v-list>
                <v-list-item-title>
                  {{ userName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  @{{ userId }}
                </v-list-item-subtitle>
                <v-divider class="ma-4"/>
                <v-list-item class="text-grey-darken-3 pa-4">
                  <v-row pa="2">
                    <v-col cols="4" offset="1" class="text-right">
                      Location:
                    </v-col>
                    <v-col cols="6" class="text-left">
                      Beijing, China Mainland
                    </v-col>
                  </v-row>
                  <v-row pa="2">
                    <v-col cols="4" offset="1" class="text-right">
                      Phone:
                    </v-col>
                    <v-col cols="6" class="text-left">
                      <span v-if="!editingMode">114514</span>
                      <span v-if="editingMode"><input v-model="phoneNumberInput"/></span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4" offset="1" class="text-right">
                      Email:
                    </v-col>
                    <v-col cols="6" class="text-left mb-3">
                      <span v-if="!editingMode">
                        {{ userEmail }}
                      </span>
                      <span v-if="editingMode"><input v-model="emailInput"/></span>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-divider class="ma-4"/>
          <v-card-actions class="justify-center">
            <v-btn-group color="info" variant="outlined" divided>
              <v-btn v-if="!editingMode" @click="handleEdit">EDIT</v-btn>
              <v-btn v-if="!editingMode" @click="handleLogout">LOGOUT</v-btn>
              <v-btn v-if="editingMode" @click="handleLogout">DONE</v-btn>
              <v-btn v-if="!editingMode" @click="triggerFileInput">UPLOAD AVATAR</v-btn>
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
  </v-row>
</template>

<style scoped>

</style>
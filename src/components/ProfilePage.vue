<script setup lang="ts">
import {logout, token} from "../auth.ts";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {BASE_API_URL} from "../constants.ts";
import {blacklist, settings, user, userEmail, userId, userName} from "../globals.ts";
import SelectMember from "./SelectMember.vue";
import {unblockFriend} from "../core/users/send.ts";

const router = useRouter();

const fileInput = ref(null);
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleUploadAvatar = (event: any) => {
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
  }).then(() => {
    axios.get(BASE_API_URL + 'users/avatar', {
      headers: {
        Authorization: token.value,
      },
      responseType: 'blob',
    }).then((response) => {
          console.log('userAvatar: ', response.data);
          const reader = new FileReader();
          reader.readAsDataURL(response.data); // change Blob into Base64
          reader.onloadend = () => {
            user.value.avatar = reader.result;
          }
        }
    )
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
      user.value.avatar = reader.result;
    };
  } catch (error) {
    console.error('Http get avatar failed -> ', error);
  }
});

const displayEditEntry = ref(undefined);
const editingEntry = ref<string | undefined>(undefined);

const inputValue = ref('');

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
  if (editingEntry.value === 'username') {
    alert('changing username to' + inputValue.value);
    editingEntry.value = undefined;
  }
}

const blackListDialog = ref(false);


</script>

<template>
  <v-row no-gutters>
    <v-dialog v-model="dialog" max-width="30vw" max-height="80vh">
      <v-card class="fill-height overflow-y-auto">
        <v-card-title>{{ editingTitle }}</v-card-title>
        <v-card-text>
          <v-text-field autofocus v-model="inputValue"></v-text-field>
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
                  <span>{{ userName }}</span>
                  <v-icon v-if="displayEditEntry==='username'" size="xs"
                          @click="editingEntry='username'; inputValue=userName">
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
                      <span>Beijing, China Mainland</span>
                      <v-icon v-if="displayEditEntry==='location'" size="xs"
                              @click="editingEntry='location'; inputValue='Beijing, China Mainland'">
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
                      <span>114514</span>
                      <v-icon v-if="displayEditEntry==='phone'" size="xs"
                              @click="editingEntry='phone'; inputValue='114514'">
                        mdi-grease-pencil
                      </v-icon>
                      <v-icon v-else></v-icon>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4" offset="1" class="text-right">
                      Email:
                    </v-col>
                    <v-col cols="6" class="text-left mb-3">
                      <span>
                        {{ userEmail }}
                      </span>
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
  </v-row>
</template>

<style scoped>

</style>
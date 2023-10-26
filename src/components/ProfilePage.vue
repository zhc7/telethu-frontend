<script setup>
import {logout, user, userEmail, userId, userName} from "../auth.js";
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter();

const editingMode = ref(false);
const phoneNumberInput = ref('');
const emailInput = ref('');

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
            </v-btn-group>
          </v-card-actions>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
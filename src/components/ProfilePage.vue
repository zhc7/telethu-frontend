<script setup>
import {logout, userId, userName} from "../auth.js";
import {useRouter} from "vue-router";

const router = useRouter();

const handleLogout = () => {
  logout();
  router.push('/login');
}
</script>

<template>
  <v-row no-gutters>
    <v-col cols="8" offset="2">
      <v-card class="mb-auto mt-6">
        <v-avatar size="80">
          <v-img src="/public/download.jpeg"/>
        </v-avatar>
        <v-card-item>
          <v-row no-gutters>
            <v-col cols="8" offset="2">
              <v-list>
                <v-list-item-title>
                  {{ userName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  @{{ userId }}
                </v-list-item-subtitle>
                <v-divider class="ma-4"/>
                <v-list-item class="text-grey-darken-3">
                  <v-row>
                    <v-col cols="4" offset="1" class="text-right">
                      Location:
                    </v-col>
                    <v-col cols="6" class="text-left">
                      Beijing, China Mainland
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4" offset="1" class="text-right">
                      Phone:
                    </v-col>
                    <v-col cols="6" class="text-left">
                      1145141919810
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4" offset="1" class="text-right">
                      Email:
                    </v-col>
                    <v-col cols="6" class="text-left">
                      <a href="#">Cindy@telethu.org</a>
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
            </v-btn-group>
          </v-card-actions>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
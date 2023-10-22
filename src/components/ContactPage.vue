<script setup>
import {ref, watch} from "vue";
import ContactList from "./ContactList.vue";

import {acceptFriend, addFriend, applyList, contacts, friendRequests} from "../chat.js";
import RequestList from "./RequestList.vue";

defineEmits((['chat']));
const displayType = ref();
const selectedContactId = ref();
const selectedRequestId = ref();
const displayApplyList = ref();
const displayContact = ref();
const displayRequest = ref();
const searchInput = ref('');
const searchFriendMode = ref('id');

const switchMode = () => {
  searchFriendMode.value = searchFriendMode.value === 'email' ? 'id' : 'email';
};

const selectContact = (newContactId) => {
  if (newContactId) {
    displayType.value = 'contactDetail';
    displayContact.value = contacts.value[newContactId];
  }
};

const selectRequest = (newRequestId) => {
  displayRequest.value = friendRequests.value[newRequestId];
}

const search = () => {
  displayType.value = 'searchResult';
  selectedContactId.value = undefined;
  displayContact.value = contacts.value['1']; //TMP
  addFriend(searchInput.value)
  console.log(searchInput.value)
  alert('喜报：你搜索成功了！');
}

const handleContactList = () => {
  displayType.value = undefined;
}

const handleApplyList = () => {
  displayType.value = 'applyList';
  selectedContactId.value = undefined;
  applyList();
  displayApplyList.value = friendRequests.value;
  console.log(friendRequests.value);
}

const handleRequestPass = (id) => {
  acceptFriend(id);
  delete friendRequests.value[id];
}

watch(selectedContactId, selectContact);
watch(selectedRequestId, selectRequest);

</script>

<template>
  <v-row class="mt-auto mb-2 d-flex flex-1-1 overflow-y-auto fill-height">
    <v-col cols="12" sm="4">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-btn @click="switchMode" :color="searchFriendMode === 'id' ? 'purple' : 'white'" class="fill-height">
              <v-icon>
                mdi-account-multiple-plus
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="10">
            <v-text-field
                :label="searchFriendMode === 'id' ? 'Add new friend by TTID' : 'Add new friend by email'"
                append-inner-icon="mdi-magnify"
                v-model="searchInput"
                @click:append-inner="search"
                variant="outlined"
                hide-details
            />
          </v-col>
        </v-row>
        <v-list>
          <v-list-item @click="handleContactList" class="text-left">
            My Friends
          </v-list-item>
          <v-list-item @click="handleApplyList" class="text-left">
            Friend Requests
          </v-list-item>
        </v-list>
      </v-container>
      <v-container v-if="displayType !== 'applyList'">
        <ContactList
            v-model="selectedContactId"
        />
      </v-container>
      <v-container v-else>
        <RequestList
            v-model="selectedRequestId"
        />
      </v-container>
    </v-col>
    <v-col cols="12" sm="6" class="d-flex flex-column flex-1-1 justify-center offset-sm-1">
      <v-card v-if="displayType === 'contactDetail' && selectedContactId" class="mb-auto mt-6">
        <v-avatar size="80">
          <v-img :src="displayContact.avatar"/>
        </v-avatar>
        <v-card-item>
          <v-list>
            <v-list-item-title>
              {{ displayContact.username }}
            </v-list-item-title>
            <v-list-item-subtitle>
              @{{ displayContact.id }}
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
          <v-divider class="ma-4"/>
          <v-card-actions class="justify-center">
            <v-btn-group color="info" variant="outlined" divided>
              <v-btn @click="$emit('chat', selectedContactId)">CHAT</v-btn>
              <v-btn>RECOMMEND</v-btn>
              <v-btn>DELETE</v-btn>
              <v-btn @click="">BLOCK</v-btn>
            </v-btn-group>
          </v-card-actions>
        </v-card-item>
      </v-card>
      <v-card v-if="displayType === 'applyList' && selectedRequestId" class="mb-auto mt-6 overflow-y-auto">
        <v-avatar size="80">
          <v-img :src="displayRequest.avatar"/>
        </v-avatar>
        <v-card-item>
          <v-list>
            <v-list-item-title>
              {{ displayRequest.username }}
            </v-list-item-title>
            <v-list-item-subtitle>
              @{{ displayRequest.id }}
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
          <v-divider class="ma-4"/>
          <v-card-actions class="justify-center">
            <v-btn-group color="info" variant="outlined" divided>
              <v-btn @click="handleRequestPass(selectedRequestId)" color="white"
                     class="bg-green mr-1 pl-2 pr-2 v-btn--density-comfortable">PASS
              </v-btn>
              <v-btn @click="handleRequestReject(selectedRequestId)" color="white"
                     class="bg-red text-white ml-1 mr-1 pl-2 pr-2 v-btn--density-comfortable">REJECT
              </v-btn>
            </v-btn-group>
          </v-card-actions>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>
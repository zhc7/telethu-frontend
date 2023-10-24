<script setup>
import {onMounted, ref, watch} from "vue";
import ContactList from "./ContactList.vue";

import {acceptFriend, addFriend, applyList, contacts, friendRequests} from "../chat.js";
import RequestList from "./RequestList.vue";

defineEmits((['chat']));
const displayRightType = ref();
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
  displayRightType.value = 'contactDetail';
  if (newContactId) {
    displayContact.value = contacts.value[newContactId];
  }
};

const selectRequest = (newRequestId) => {
  displayRightType.value = 'requestDetail';
  if (newRequestId) {
    displayRequest.value = friendRequests.value[newRequestId];
  }
}

const search = () => {
  displayRightType.value = 'searchResult';
  addFriend(searchInput.value)
  alert('喜报：你搜索成功了！');
}

const handleContactList = () => {
  displayType.value = undefined;
  displayType.value = 'contactList';
}

const handleRequestList = () => {
  displayType.value = undefined;
  displayType.value = 'requestList';
  applyList();
  displayApplyList.value = friendRequests.value;
  console.log(friendRequests.value);
}

const handleRequestPass = (id) => {
  acceptFriend(id);
  displayType.value = 'requestList'
  const friendInfo = friendRequests.value[id];
  delete friendRequests.value[id];
  contacts.value[id] = friendInfo[id];
  contacts.value[id]['messages'] = [];
  displayContact.value = friendInfo;
  displayRightType.value = 'contactDetail';
}

watch(selectedContactId, selectContact);
watch(selectedRequestId, selectRequest);

onMounted(() => {
  displayType.value = 'contactList';
})

</script>

<template>
  <v-row class="mt-auto mb-2 d-flex flex-1-1 overflow-y-auto fill-height">
    <v-col cols="12" sm="4" class="d-flex flex-column">
      <v-list class="flex-0-0">
        <v-list-item class="bg-purple">
          <template #prepend>
            <v-icon></v-icon>
          </template>
          <v-list-item-title class="pa-3 ma-0 fill-height">
            {{ displayType === 'contactList' ? 'Contact List' : 'Add Friends' }}
          </v-list-item-title>
          <template #append>
            <v-icon
                v-show="displayType === 'contactList'"
                @click="handleRequestList">
              mdi-plus
            </v-icon>
            <v-icon
                v-show="displayType === 'requestList'"
                @click="handleContactList">
              mdi-account-multiple
            </v-icon>
          </template>
        </v-list-item>
        <v-list-item>
          <v-text-field
              :label="displayType === 'contactList' ? 'Search in contacts...' : 'Search for new friends...'"
              v-model="searchInput"
              variant="outlined"
              hide-details
              density="compact"
              class="mt-3"
          >
            <template #append>
              <v-icon @click="search">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </v-list-item>
      </v-list>
      <ContactList
          v-model="selectedContactId"
          v-show="displayType === 'contactList'"
      />
      <RequestList
          v-model="selectedRequestId"
          v-show="displayType === 'requestList'"
          :active="displayType === 'requestList'"
          @accept="acceptId => handleRequestPass(acceptId)"
      />
    </v-col>
    <v-col cols="12" sm="6" class="d-flex flex-column flex-1-1 justify-center offset-sm-1">
      <v-card v-if="displayRightType === 'contactDetail'" class="mb-auto mt-6">
        <v-avatar size="80">
          <v-img :src="displayContact.avatar" cover/>
        </v-avatar>
        <v-card-item>
          <v-list>
            <v-list-item-title>
              {{ displayContact.name }}
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
              <v-row v-if="displayContact.email">
                <v-col cols="4" offset="1" class="text-right">
                  Email:
                </v-col>
                <v-col cols="6" class="text-left">
                  <a href="#">{{ displayContact.email }}</a>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
          <v-divider class="ma-4"/>
          <v-card-actions class="justify-center">
            <v-btn-group color="info" variant="outlined" divided>
              <v-btn @click="$emit('chat', displayContact.id)">CHAT</v-btn>
              <v-btn>RECOMMEND</v-btn>
              <v-btn>DELETE</v-btn>
              <v-btn @click="">BLOCK</v-btn>
            </v-btn-group>
          </v-card-actions>
        </v-card-item>
      </v-card>
      <v-card v-if="displayRightType === 'requestDetail'" class="mb-auto mt-6 overflow-y-auto">
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

.v-list-item--active {
  background-color: #248aff !important;
}
</style>
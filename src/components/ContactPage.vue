<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import ContactList from "./ContactList.vue";

import {
  acceptFriend,
  rejectFriend,
  addFriend,
  applyList,
  friendRequests,
  searchForFriend,
  searchResult,
} from "../core/chat.ts";

import {activeContactId, activeRequestId, contactPageContentLeft, messages, selectedContactInfo} from "../globals.ts"

import RequestList from "./RequestList.vue";
import FriendProfile from "./ContactProfile.vue";
import {getUser} from "../core/data.ts";


defineEmits(["chat"]);
const searchInput = ref("");
const searchFriendMode = ref("id");
const displayGroup = ref(false);

const selectContact = async (newContactId: number) => {
  selectedContactInfo.value.info = undefined;
  selectedContactInfo.value.source = undefined;
  if (newContactId !== -1) {
    const userInfo = await getUser(newContactId);
    selectedContactInfo.value.info = userInfo;
    selectedContactInfo.value.source = "contactList"
  }
};

const selectRequest = async (newRequestId: number) => {
  selectedContactInfo.value.info = undefined;
  selectedContactInfo.value.source = undefined;
  if (newRequestId !== -1) {
    const userInfo = await getUser(newRequestId);
    selectedContactInfo.value.info = userInfo;
    selectedContactInfo.value.source = "requestList"
  }
};

const search = () => {
  searchForFriend(searchInput.value);
};

const handleApplyFriend = (friendId: number) => {
  addFriend(friendId);
  alert("喜报：你发送了申请！");
}

const handleContactList = () => {
  contactPageContentLeft.value = 0;
};

const handleRequestList = () => {
  contactPageContentLeft.value = 1;
  // applyList();
  // displayApplyList.value = friendRequests.value;
  console.log(friendRequests.value);
};

const handleRequestPass = (id: number) => {
  alert("喜报：你通过了好友的申请！")
  acceptFriend(id);
  displayType.value = "requestList";
  if (messages.value[id] === undefined) {
    messages.value[id] = [];
  }
  getUser(id).then((contact) => {
    displayContact.value = contact;
  })
  delete friendRequests.value[id];
  displayRightType.value = "contactDetail";
};

const handleRequestReject = (id: number) => {
  rejectFriend(id);
  displayType.value = "requestList";
  delete friendRequests.value[id];
  displayRightType.value = "contactDetail";
  alert("喜报：好友申请被你拒绝了！");
};

watch(activeContactId, selectContact);
watch(activeRequestId, selectRequest);

</script>

<template>
  <v-row class="mt-auto mb-2 d-flex flex-1-1 overflow-y-auto fill-height">
    <v-col
        cols="12"
        sm="4"
        class="d-flex flex-column fill-height overflow-y-auto"
    >
      <v-list class="flex-0-0">
        <v-list-item class="bg-purple">
          <template #prepend>
            <v-icon></v-icon>
          </template>
          <v-list-item-title class="pa-3 ma-0 fill-height">
            {{ contactPageContentLeft === 0 ? "Contact List" : "Add Friends" }}
          </v-list-item-title>
          <template #append>
            <v-icon
                v-show="contactPageContentLeft === 0"
                @click="handleRequestList"
            >
              mdi-plus
            </v-icon>
            <v-icon
                v-show="contactPageContentLeft === 1"
                @click="handleContactList"
            >
              mdi-account-multiple
            </v-icon>
          </template>
        </v-list-item>
        <v-list-item>
          <v-text-field
              :label="
              contactPageContentLeft === 0
                ? 'Search in contacts...'
                : 'Search for new friends...'
            "
              v-model="searchInput"
              variant="outlined"
              hide-details
              density="compact"
              class="mt-3"
          >
            <template #prepend>
              <v-icon v-if="!displayGroup" @click="displayGroup = !displayGroup"
              >mdi-account
              </v-icon
              >
              <v-icon v-else @click="displayGroup = !displayGroup"
              >mdi-account-group
              </v-icon
              >
            </template>
            <template #append>
              <v-icon @click="search">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </v-list-item>
      </v-list>
      <ContactList
          v-model="activeContactId"
          v-show="contactPageContentLeft === 0"
          class="fill-height overflow-y-auto"
          :displayType="displayGroup ? 'group' : 'user'"
          :searchInput="searchInput"
      />
      <RequestList
          v-model="activeRequestId"
          v-show="contactPageContentLeft === 1"
          @accept="(acceptId) => handleRequestPass(acceptId)"
          @reject="(rejectId) => handleRequestReject(rejectId)"
      />
    </v-col>
    <v-col
        cols="12"
        sm="6"
        class="d-flex flex-column flex-1-1 justify-center offset-sm-1"
    >
      <FriendProfile
          class="overflow-y-auto"
          @accept="(acceptId) => handleRequestPass(acceptId)"
          @reject="(rejectId) => handleRequestReject(rejectId)"
          @apply="(applyId) => handleApplyFriend(applyId)"
      >
      </FriendProfile>
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

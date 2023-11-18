<script setup>
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

import {contacts, displayRightType} from "../globals.ts"

import RequestList from "./RequestList.vue";
import FriendProfile from "./ContactProfile.vue";


const emit = defineEmits(["chat"]);
const displayType = ref();
const selectedContactId = ref();
const selectedRequestId = ref();
const displayApplyList = ref();
const displayContact = ref();
const displayRequest = ref();
const searchInput = ref("");
const searchFriendMode = ref("id");
const displayGroup = ref(false);

const selectContact = (newContactId) => {
  displayRightType.value = "contactDetail";
  if (newContactId) {
    displayContact.value = contacts.value[newContactId];
  }
};

const selectRequest = (newRequestId) => {
  displayRightType.value = "requestDetail";
  if (newRequestId) {
    displayRequest.value = friendRequests.value[newRequestId];
  }
};

const search = () => {
  searchForFriend(searchInput.value);
};

const handleApplyFriend = (friendId) => {
  addFriend(friendId);
  alert("喜报：你发送了申请！");
}

const handleContactList = () => {
  displayType.value = undefined;
  displayType.value = "contactList";
};

const handleRequestList = () => {
  displayType.value = undefined;
  displayType.value = "requestList";
  applyList();
  displayApplyList.value = friendRequests.value;
  console.log(friendRequests.value);
};

const handleRequestPass = (id) => {
  alert("喜报：你通过了好友的申请！")
  acceptFriend(id);
  displayType.value = "requestList";
  const friendInfo = friendRequests.value[id];
  if (!friendInfo.name) {
    friendInfo.name = friendInfo.username;
    delete friendInfo.username;
  }
  contacts.value[id] = friendInfo;
  if (!contacts.value[id]["messages"]) {
    contacts.value[id]["messages"] = [];
  }
  if (contacts.value[id]["mute"] === undefined) {
    contacts.value[id]["mute"] = false;
  }
  displayContact.value = friendInfo;
  delete friendRequests.value[id];
  displayRightType.value = "contactDetail";
};

const handleRequestReject = (id) => {
  rejectFriend(id);
  displayType.value = "requestList";
  delete friendRequests.value[id];
  displayRightType.value = "contactDetail";
  alert("喜报：好友申请被你拒绝了！");
};

watch(selectedContactId, selectContact);
watch(selectedRequestId, selectRequest);

onMounted(() => {
  displayType.value = "contactList";
});
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
            {{ displayType === "contactList" ? "Contact List" : "Add Friends" }}
          </v-list-item-title>
          <template #append>
            <v-icon
                v-show="displayType === 'contactList'"
                @click="handleRequestList"
            >
              mdi-plus
            </v-icon>
            <v-icon
                v-show="displayType === 'requestList'"
                @click="handleContactList"
            >
              mdi-account-multiple
            </v-icon>
          </template>
        </v-list-item>
        <v-list-item>
          <v-text-field
              :label="
              displayType === 'contactList'
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
          v-model="selectedContactId"
          v-show="displayType === 'contactList'"
          class="fill-height overflow-y-auto"
          :displayType="displayGroup ? 'group' : 'user'"
          :searchInput="searchInput"
      />
      <RequestList
          v-model="selectedRequestId"
          v-show="displayType === 'requestList'"
          :active="displayType === 'requestList'"
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
          v-if="displayRightType === 'contactDetail'"
          :display="displayRightType === 'contactDetail'"
          :source="'contactDetail'"
          :displayContact="displayContact"
      >
      </FriendProfile>
      <FriendProfile
          v-if="displayRightType === 'requestDetail'"
          :display="displayRightType === 'requestDetail'"
          :displayContact="displayRequest"
          :source="'requestDetail'"
          class="overflow-y-auto"
          @accept="(acceptId) => handleRequestPass(acceptId)"
          @reject="(rejectId) => handleRequestReject(rejectId)"
      >
      </FriendProfile>

      <FriendProfile
          v-if="displayRightType === 'searchResult'"
          :display="displayRightType === 'searchResult'"
          :displayContact="searchResult"
          :source="'searchResult'"
          class="overflow-y-auto"
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

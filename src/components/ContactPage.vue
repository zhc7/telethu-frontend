<script setup lang="ts">
import {ref, watch} from "vue";
import ContactList from "./ContactList.vue";

import {friendRequests,} from "../core/chat.ts";

import {
  activeContactId,
  activeRequestId,
  activeSearchId,
  contactPageContentLeft,
  contactPageProfileSource,
  requests,
  selectedContactInfo
} from "../globals.ts"

import RequestList from "./RequestList.vue";
import ContactProfile from "./ContactProfile.vue";
import {getUser} from "../core/data.ts";
import {acceptFriend, rejectFriend, searchForFriend} from "../core/users/send.ts";
import SearchResultList from "./SearchResultList.vue";
import {DEBUG} from "../constants.ts";
import {callSnackbar} from "../utils/snackbar.ts";


defineEmits(["chat"]);
const searchInput = ref("");
const searchFriendMode = ref("id");
const displayGroup = ref(false);

const selectContact = async (newContactId: number) => {
  contactPageProfileSource.value = 'contactList'
};

const selectRequest = async (newRequestId: number) => {
  contactPageProfileSource.value = 'requestList';
};

const search = () => {
  searchForFriend(searchInput.value);
};

const handleContactList = () => {
  contactPageContentLeft.value = 0;
};

const handleRequestList = () => {
  contactPageContentLeft.value = 1;
  if (DEBUG) console.log(friendRequests.value);
};

const handleRequestPass = async (id: number) => {
  acceptFriend(id).then(() => {
    selectedContactInfo.value = getUser(id);
    activeContactId.value = id;
    contactPageProfileSource.value = 'contactList';
    callSnackbar("New friend!", "green")
  });
};

const handleRequestReject = (id: number) => {
  rejectFriend(id);
  delete friendRequests.value[id];
  alert("喜报：好友申请被你拒绝了！\nGood news! Request turned down! ");
};

watch(activeContactId, selectContact);
watch(activeRequestId, selectRequest);

</script>

<template>
  <v-row class="mt-auto mb-2 overflow-y-auto fill-height">
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
          <template #append style="position: relative">
            <div class="badge" v-if="requests.length">{{ requests.length }}</div>
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
              @input="(searchInput ? search : () => {})()"
          >
            <template #prepend>
              <v-icon v-if="!displayGroup" @click="displayGroup = !displayGroup">mdi-account</v-icon>
              <v-icon v-else @click="displayGroup = !displayGroup">mdi-account-group</v-icon>
            </template>
            <template #append>
              <v-icon @click="search">mdi-magnify</v-icon>
            </template>
          </v-text-field>
        </v-list-item>
      </v-list>
      <ContactList
          v-show="contactPageContentLeft === 0"
          class="fill-height overflow-y-auto"
          :displayType="displayGroup ? 'group' : 'user'"
          :searchInput="searchInput"
      />
      <RequestList
          v-model="activeRequestId"
          v-show="contactPageContentLeft === 1 && !searchInput"
          @accept="(acceptId) => handleRequestPass(acceptId)"
          @reject="(rejectId) => handleRequestReject(rejectId)"
      />
      <SearchResultList
          v-model="activeSearchId"
          v-show="contactPageContentLeft === 1 && searchInput"
      />
    </v-col>
    <v-col
        cols="12"
        sm="6"
        class="d-flex flex-column flex-1-1 justify-center offset-sm-1 fill-height"
    >
      <ContactProfile
          v-show="contactPageProfileSource === 'contactList'"
          class="overflow-y-auto"
          :contact-id="activeContactId"
      >
      </ContactProfile>
      <ContactProfile
          v-show="contactPageProfileSource === 'requestList'"
          class="overflow-y-auto"
          :contact-id="activeRequestId"
      >
      </ContactProfile>
      <ContactProfile
          v-show="contactPageProfileSource === 'searchResult'"
          class="overflow-y-auto"
          :contact-id="activeSearchId"
      >
      </ContactProfile>
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

.badge {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  line-height: 16px;
  background-color: red;
  font-size: 12px;
  right: 0.7em;
  top: 0.6em;
}

.v-btn {
  font-size: 15px;
  font-weight: bold;
}

</style>

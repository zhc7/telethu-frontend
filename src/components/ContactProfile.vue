<script setup>
import {
  blockFriend,
  contacts,
  deleteFriend,
  groupAddMember,
  unblockFriend,
} from "../chat.js";
import { computed, ref } from "vue";
import ProfileRow from "./ProfileRow.vue";

const props = defineProps(["displayContact", "display"]);

const groupAddMemberDialog = ref(false);
const groupAddMemberLoading = ref(false);
const groupAddMemberSelecting = ref([]);

const deleteConfirmDialog = ref(false);

const switchValueMute = ref(props.displayContact.mute);
const onSwitchChangeMute = () => {
  props.displayContact.mute = switchValueMute.value;
  console.log("mute:", props.displayContact.mute);
};
const switchValuePin = ref(props.displayContact.pin);
const onSwitchChangePin = () => {
  props.displayContact.pin = switchValuePin.value;
  console.log("pin:", props.displayContact.pin);
};
const switchValueBlock = ref(false);
const onSwitchChangeBlock = () => {
  console.log("block:", switchValueBlock.value);
  if (switchValueBlock.value) {
    props.displayContact.block = true;
    blockFriend(props.displayContact.id, switchValueBlock.value);
  } else {
    props.displayContact.block = false;
    unblockFriend(props.displayContact.id);
  }
};

const friendCircle = ref(["THU", "PKU", "CMU", "MIT"]);
const friendCircleSelect = ref([]);
const newName = ref("");

const ifGroup = computed(() => {
  return props.displayContact.category === "group";
});

const handleDelete = () => {
  deleteConfirmDialog.value = false;
  deleteFriend(props.displayContact.id);
};

const editName = () => {
  console.log("editName");
};

const handleSelect = (contact) => {
  console.log(contact);
  groupAddMemberSelecting.value.push(contact.id);
};

const handlePlusMember = () => {
  console.log(
    "log",
    groupAddMemberSelecting.value + "",
    "disContId",
    props.displayContact.id
  );
  groupAddMemberLoading.value = true;
  for (const id of groupAddMemberSelecting.value) {
    console.log("Adding group member", props.displayContact.id, id);
    const contact = contacts.value[id];
    groupAddMember(props.displayContact.id, id);
    const memberInfo = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
    };
    contacts.value[props.displayContact.id].id2member[contact.id] = memberInfo;
    contacts.value[props.displayContact.id].members.push(memberInfo);
  }
  groupAddMemberSelecting.value = [];
  groupAddMemberLoading.value = false;
  groupAddMemberDialog.value = false;
};

const handlePlus = () => {
  groupAddMemberDialog.value = true;
  groupAddMemberSelecting.value = [];
};

const handleCancel = () => {
  groupAddMemberDialog.value = false;
  deleteConfirmDialog.value = false;
  groupAddMemberSelecting.value = [];
};

const filterContacts = computed(() => {
  return Object.keys(contacts.value)
    .filter((id) => {
      return (
        contacts.value[id].category === "user" &&
        groupAddMemberSelecting.value.indexOf(id) === -1 &&
        Object.keys(props.displayContact.id2member).indexOf(id) === -1
      );
    })
    .map((id) => {
      return {
        id: id,
        name: contacts.value[id].name,
        avatar: contacts.value[id].avatar,
      };
    });
});
</script>

<template>
  <v-card class="mb-auto mt-6 overflow-y-auto" v-show="display">
    <v-avatar size="80" class="mt-5">
      <v-img :src="displayContact.avatar" cover />
    </v-avatar>
    <v-card-item class="overflow-y-auto">
      <v-list class="overflow-y-auto">
        <v-list-item-title>
          {{ displayContact.name }}
        </v-list-item-title>
        <v-list-item-subtitle> @{{ displayContact.id }} </v-list-item-subtitle>
        <v-list-item
          v-if="displayContact.category === 'user'"
          class="text-grey-darken-3"
        >
          <v-divider class="ma-4" />
          <div>
            <ProfileRow>
              <template v-slot:title> Location: </template>
              <template v-slot:content> Beijing, China Mainland </template>
            </ProfileRow>
            <ProfileRow>
              <template #title> Phone: </template>
              <template #content> 114514 </template>
            </ProfileRow>
            <ProfileRow v-show="displayContact.email">
              <template #title> Email: </template>
              <template #content> {{ displayContact.email }} </template>
            </ProfileRow>
          </div>
        </v-list-item>
        <div
          v-if="displayContact.category === 'group'"
          class="overflow-y-auto fill-height"
        >
          <v-divider class="ma-4" />
          <v-card-title class="ma-7"> Members </v-card-title>
          <div class="overflow-y-auto fill-height d-flex flex-wrap">
            <div
              v-for="member in displayContact.members"
              :key="member"
              class="d-flex flex-column align-center ma-auto mb-5"
            >
              <v-avatar size="60">
                <v-img :src="member.avatar" id="member-avatar" cover />
              </v-avatar>
              <p>{{ member.name }}</p>
            </div>
            <div class="d-flex flex-column align-center ma-auto mb-5">
              <v-avatar size="60" color="indigo" @click="handlePlus">
                <v-icon style="font-size: 35px"
                  >mdi-account-multiple-plus</v-icon
                >
              </v-avatar>
              <p class="text-indigo">...</p>
            </div>
          </div>
        </div>
      </v-list>
      <v-divider class="ma-4" />
      <v-col>
        <v-row style="display: flex; align-items: center" class="ma-3">
          <!-- TODO: add rename function -->
          <p style="flex: 1" class="text-right pr-4">Rename:</p>
          <v-text-field
            variant="outlined"
            label="New name"
            density="compact"
            style="flex: 2"
            hide-details
            append-inner-icon="mdi-pencil"
            v-model="newName"
            @click:append-inner="editName"
          />
        </v-row>
        <v-row
          style="display: flex; align-items: center"
          class="ma-3 text-right"
        >
          <!-- TODO: add friend circle function -->
          <p style="flex: 1" class="pr-4">Label:</p>
          <v-combobox
            v-model="friendCircleSelect"
            chips
            :items="friendCircle"
            multiple
            variant="outlined"
            density="compact"
            hide-details
            style="flex: 2"
          ></v-combobox>
        </v-row>
        <v-row
          style="display: flex; align-items: center"
          class="ma-1 text-right"
        >
          <p style="flex: 1" class="pr-4">Mute:</p>
          <v-switch
            style="flex: 2"
            hide-details
            color="indigo"
            v-model="switchValueMute"
            @change="onSwitchChangeMute"
          ></v-switch>
        </v-row>
        <v-row style="display: flex; align-items: center" class="ma-1">
          <p style="flex: 1" class="text-right pr-4">Pin:</p>
          <v-switch
            style="flex: 2"
            hide-details
            color="indigo"
            v-model="switchValuePin"
            @change="onSwitchChangePin"
          ></v-switch>
        </v-row>
        <v-row style="display: flex; align-items: center" class="ma-1">
          <p style="flex: 1" class="text-right pr-4">Block:</p>
          <v-switch
            style="flex: 2"
            hide-details
            color="error"
            v-model="switchValueBlock"
            @change="onSwitchChangeBlock"
          ></v-switch>
        </v-row>
      </v-col>
      <v-divider class="ma-4" />
      <v-card-actions>
        <v-col>
          <v-row v-if="!ifGroup" style="display: flex; justify-content: center">
            <!-- TODO: add recommend function -->
            <v-btn color="indigo" style="font-size: 15px; font-weight: bold"
              >Recommend</v-btn
            >
          </v-row>
          <v-row v-if="!ifGroup" style="display: flex; justify-content: center">
            <!-- TODO: test delete friend function -->
            <v-btn
              color="error"
              style="font-size: 15px; font-weight: bold"
              @click="deleteConfirmDialog = true"
              >Delete Friend
            </v-btn>
          </v-row>
          <v-row v-else style="display: flex; justify-content: center">
            <v-btn
              color="error"
              style="font-size: 15px; font-weight: bold"
              @click="deleteConfirmDialog = true"
              >Quit Group
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-card-item>

    <v-dialog v-model="deleteConfirmDialog" max-width="30vw">
      <v-card>
        <v-alert
          type="warning"
          title="Are you sure?"
          text="This operation cannot be undone."
        ></v-alert>
        <v-card-actions class="justify-end">
          <v-btn @click="handleCancel">cancel</v-btn>
          <v-btn @click="handleDelete">delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="groupAddMemberDialog" max-width="30vw">
      <v-card>
        <v-card-title class="text-center"> Add members </v-card-title>
        <v-card-text>
          <v-text-field density="compact" label="Search" />
          <div class="d-flex overflow-x-auto" v-if="groupAddMemberSelecting">
            <!-- TODO: format cells -->
            <div
              v-for="member in displayContact.members"
              :key="member"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              v-ripple
            >
              <v-avatar>
                <v-img :src="member.avatar" cover></v-img>
              </v-avatar>
              <p>{{ member.name }}</p>
            </div>
            <div
              v-for="id in groupAddMemberSelecting"
              :key="id"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              @click="
                groupAddMemberSelecting = groupAddMemberSelecting.filter(
                  (i) => i.id !== id
                )
              "
              v-ripple
            >
              <v-avatar>
                <v-img :src="contacts[id].avatar" cover></v-img>
              </v-avatar>
              <p>{{ contacts[id].name }}</p>
            </div>
          </div>
          <v-list>
            <v-list-item v-for="contact in filterContacts">
              <template #prepend>
                <v-avatar>
                  <v-img :src="contact.avatar" cover></v-img>
                </v-avatar>
              </template>
              <v-list-item-title>
                {{ contact.name }}
              </v-list-item-title>
              <template #append>
                <v-btn @click="handleSelect(contact)" color="indigo">
                  Append
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="mb-3 mr-4">
          <v-spacer />
          <v-btn @click="handleCancel">Cancel</v-btn>
          <v-btn @click="handlePlusMember" :loading="groupAddMemberLoading"
            >Add</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>

<script setup lang="ts">
import {computed, ref} from "vue";
import ProfileRow from "./ProfileRow.vue";
import SelectMember from "./SelectMember.vue";
import {
  activeContactId,
  activeRequestId,
  blacklist,
  contactPageProfileSource,
  contacts,
  requests,
  settings,
  user,
  userContacts,
  userId
} from "../globals.ts";
import {useRouter} from "vue-router";
import {getUser} from "../core/data.ts";
import {
  createGroup,
  exitGroup,
  groupAddAdmin,
  groupChangeOwner,
  groupRemoveAdmin,
  removeGroupMember
} from "../core/groups/send.ts";
import {acceptFriend, applyFriend, blockFriend, deleteFriend, rejectFriend, unblockFriend} from "../core/users/send.ts";
import Avatar from "./Avatar.vue";
import {ContactsData, GroupData, UserData} from "../utils/structs.ts";


const props = defineProps(['contactId']);
defineEmits(["accept", "reject", "apply"]);

const groupAddMemberDialog = ref(false);

const deleteConfirmDialog = ref(false);
const changeOwnerDialog = ref(false);

const switchValueMute = computed<boolean>({
  get: () => {
    return settings.value.muted.includes(displayContactInfo.value.id);
  },
  set: (value) => {
    if (displayContactInfo.value.id < 1) {
      return;
    }
    if (value) {
      settings.value.muted.push(displayContactInfo.value.id);
    } else {
      const selId = displayContactInfo.value.id;
      settings.value.muted = settings.value.muted.filter(id => id !== selId);
    }
  },
})

const switchValuePin = computed<boolean>({
  get: () => {
    return settings.value.pinned.includes(displayContactInfo.value.id);
  },
  set: (value) => {
    if (displayContactInfo.value.id < 1) {
      return;
    }
    if (value) {
      settings.value.pinned.push(displayContactInfo.value.id);
    } else {
      settings.value.pinned = settings.value.pinned.filter(id => id !== displayContactInfo.value.id);
    }
  },
})

const switchValueBlock = computed<boolean>({
  get: () => {
    return blacklist.value.includes(displayContactInfo.value.id);
  },
  set: (value) => {
    if (displayContactInfo.value.id < 1) {
      return;
    }
    if (value) {
      settings.value.blocked.push(displayContactInfo.value.id);
      blockFriend(displayContactInfo.value.id);
    } else {
      settings.value.blocked = settings.value.blocked.filter(id => id !== displayContactInfo.value.id);
      unblockFriend(displayContactInfo.value.id);
    }
  },
})

const router = useRouter();


const friendCircle = ref(["THU", "PKU", "CMU", "MIT"]);
const friendCircleSelect = ref([]);
const newName = ref("");

const memberInfoTable = computed(() => {
  return displayContactInfo.value.members;
})

const handleDelete = () => {
  if (!displayContactInfo.value || displayContactInfo.value.category === '') {
    return;
  }
  deleteConfirmDialog.value = false;
  if (displayContactInfo.value.category === 'user') {
    deleteFriend(displayContactInfo.value.id);
  } else {
    if (displayContactInfo.value.owner === userId.value && displayContactInfo.value.members.length > 1) {
      alert('不许退群！成年人要学会负责任，你作为群主退群让其他群成员咋办？起码指定一个接班人再说！')
    } else {
      exitGroup(displayContactInfo.value.id);
    }
  }
};

const handleApplyFriend = (friendId: number) => {
  applyFriend(friendId);
  alert("喜报：你发送了申请！\nGood news! You sent an application! ");
};

const editName = () => {
  console.log("editName");
};

const displayContactInfo = computed(() => getUser(props.contactId));

const handleKickMember = (memberId: number) => {
  removeGroupMember(displayContactInfo.value.id, memberId);
}

const handleAddAdmin = (memberId: number) => {
  groupAddAdmin(displayContactInfo.value.id, memberId);
}

const handleRemoveAdmin = (memberId: number) => {
  groupRemoveAdmin(displayContactInfo.value.id, memberId);
}

const handleAcceptFriend = () => {
  const id = displayContactInfo.value.id;
  acceptFriend(id);
  activeContactId.value = id;
  contactPageProfileSource.value = 'contactList';
}

const handleRejectFriend = () =>{
  const id = displayContactInfo.value.id;
  rejectFriend(id);
  activeRequestId.value = 0;
}

</script>

<template>
  <v-card class="mb-auto mt-6 overflow-y-auto" v-if="displayContactInfo.id > 0">
    <Avatar :contact-id="displayContactInfo.id"></Avatar>
    <v-card-item class="overflow-y-auto">
      <v-list class="overflow-y-auto">
        <v-list-item-title>
          {{ displayContactInfo.name }}
        </v-list-item-title>
        <v-list-item-subtitle> @{{ displayContactInfo ? displayContactInfo.id : '' }}
        </v-list-item-subtitle>
        <v-list-item
            v-if="displayContactInfo && displayContactInfo.category === 'user'"
            class="text-grey-darken-3"
        >
          <v-divider class="ma-4"/>
          <div>
            <ProfileRow>
              <template v-slot:title> Location:</template>
              <template v-slot:content> Beijing, China Mainland</template>
            </ProfileRow>
            <ProfileRow>
              <template #title> Phone:</template>
              <template #content> 114514</template>
            </ProfileRow>
            <ProfileRow v-show="displayContactInfo && displayContactInfo.category === 'user'">
              <template #title> Email:</template>
              <template #content> {{ (displayContactInfo as UserData).email ? (displayContactInfo as UserData).email : '' }}</template>
            </ProfileRow>
          </div>
        </v-list-item>
        <div
            v-if="displayContactInfo && displayContactInfo.category === 'group'"
            class="overflow-y-auto fill-height"
        >
          <v-divider class="ma-4"/>
          <v-card-title class="ma-7"> {{ (displayContactInfo as GroupData).owner }}</v-card-title>
          <div class="overflow-y-auto fill-height d-flex flex-wrap">
            <div
                v-for="member in memberInfoTable"
                :key="member"
                class="d-flex flex-column align-center ma-auto mb-5 pt-4 member-pop"
            >

              <Avatar
                  :contact-id="member"
                  size="60"
                  style="position: relative"
                  :style="displayContactInfo.owner === member ? 'border: #008eff 4px double' : displayContactInfo.admin.includes(member) ? 'border: #008eff 2px solid' : '' "
              />
              <div class="badge-kick"
                   v-if="displayContactInfo.owner === userId && member !== userId || displayContactInfo.admin.includes(userId) && member !== userId && member !== displayContactInfo.owner && !displayContactInfo.admin.includes(member)"
                   @click="handleKickMember(member)">——
              </div>
              <p>{{
                  (() => {
                    member;
                    return getUser(member).name;
                  })()
                }}</p>
              <div class="badge-lift"
                   v-if="displayContactInfo.owner === userId && member !== userId && !displayContactInfo.admin.includes(member)"
                   @click="handleAddAdmin(member)">|
              </div>
              <div class="badge-fire"
                   v-if="displayContactInfo.owner === userId && member !== userId && displayContactInfo.admin.includes(member)"
                   @click="handleRemoveAdmin(member)">*
              </div>
            </div>
            <div class="d-flex flex-column align-center ma-auto mb-5">
              <v-avatar size="60" color="indigo" @click="groupAddMemberDialog = true">
                <v-icon style="font-size: 35px"
                >mdi-account-multiple-plus
                </v-icon
                >
              </v-avatar>
              <p>...</p>
            </div>
          </div>
        </div>
      </v-list>
      <v-divider class="ma-4"/>
      <v-col v-if="displayContactInfo.id !== user.id">
        <v-row style="display: flex; align-items: center" class="ma-1">
          <p style="flex: 1" class="text-right pr-4">Pin:</p>
          <v-switch
              style="flex: 2"
              hide-details
              color="indigo"
              v-model="switchValuePin"
          ></v-switch>
        </v-row>
        <v-row style="display: flex; align-items: center" class="ma-1">
          <p style="flex: 1" class="text-right pr-4">Mute:</p>
          <v-switch
              style="flex: 2"
              hide-details
              color="indigo"
              v-model="switchValueMute"
          ></v-switch>
        </v-row>
        <v-row style="display: flex; align-items: center" class="ma-1">
          <p style="flex: 1" class="text-right pr-4">Block:</p>
          <v-switch
              style="flex: 2"
              hide-details
              color="indigo"
              v-model="switchValueBlock"
          ></v-switch>
        </v-row>
      </v-col>
      <v-card-actions class="justify-center">
        <div class="d-flex flex-column">
          <v-btn
              v-if="displayContactInfo.category === 'group' && displayContactInfo.owner === user.id"
              color="primary"
              @click="changeOwnerDialog=true"
          >Change Ownership
          </v-btn>
          <v-btn color="green" v-if="requests.includes(displayContactInfo.id)" @click="handleAcceptFriend">Accept
          </v-btn>
          <v-btn color="error" v-if="requests.includes(displayContactInfo.id)" @click="handleRejectFriend">Reject</v-btn>
          <v-btn v-if="!contacts.includes(displayContactInfo.id) && displayContactInfo.id !== user.id && !requests.includes(displayContactInfo.id)" color="blue" @click="handleApplyFriend(activeRequestId)">Apply</v-btn>
          <v-btn v-if="displayContactInfo.id === user.id" color="primary" @click="router.push('/profile')">Goto Profile</v-btn>
          <slot name="buttons"/>
          <v-btn color="error" v-if="contacts.includes(displayContactInfo.id) && displayContactInfo.id !== user.id" @click="deleteConfirmDialog=true">Delete</v-btn>
        </div>
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
          <v-btn @click="deleteConfirmDialog = false">cancel</v-btn>
          <v-btn @click="handleDelete">{{ displayContactInfo.category === 'group' ? 'Quit Group' : 'Delete' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <SelectMember
        v-model:show-dialog="groupAddMemberDialog"
        :pinned="displayContactInfo.members"
        :possible="userContacts"
        :title="'Add Member'"
        :base-group="displayContactInfo"
        @confirm="(list, name) => {
          groupAddMemberDialog=false;
          createGroup(name, list);
        }"
    />
    <SelectMember
        v-model:show-dialog="changeOwnerDialog"
        :single="true"
        title="Change Ownership"
        :possible="displayContactInfo.members"
        :pinned="[]"
        @confirm="(target, _) => {
          changeOwnerDialog=false;
          groupChangeOwner(displayContactInfo.id, target);
        }"
    />
  </v-card>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}

.member-pop {
  position: relative;
}

.badge-kick {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  position: absolute;
  right: 0;
  top: 12px;
  line-height: 10px;
  font-size: 12px;
  color: white;
  background-color: red;
}

.badge-lift {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  position: absolute;
  right: 0;
  top: 28px;
  line-height: 10px;
  font-size: 12px;
  color: white;
  background-color: dodgerblue;
}

.badge-fire {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  position: absolute;
  right: 0;
  top: 28px;
  line-height: 10px;
  font-size: 12px;
  color: white;
  background-color: grey;
}

.v-btn {
  font-size: 15px;
  font-weight: bold;
}


</style>

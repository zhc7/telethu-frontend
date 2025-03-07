<script setup lang="ts">
import {computed, ref, watch} from "vue";
import ProfileRow from "./ProfileRow.vue";
import SelectMember from "./SelectMember.vue";
import Tag from "./Tag.vue";
import {
  activeChatId,
  activeContactId,
  activeRequestId,
  blacklist, candidatesList,
  contactPageProfileSource,
  contacts,
  currentPage,
  floatingContactId,
  requests,
  settings,
  showProfileDialog,
  user,
  userContacts,
  userId
} from "../globals.ts";
import {useRouter} from "vue-router";
import {getUser} from "../core/data.ts";
import {
  changeGroupName,
  dismissGroup,
  exitGroup,
  groupAddAdmin,
  groupAddMember,
  groupChangeOwner,
  groupRemoveAdmin,
  removeGroupMember
} from "../core/groups/send.ts";
import {acceptFriend, applyFriend, blockFriend, deleteFriend, rejectFriend, unblockFriend} from "../core/users/send.ts";
import Avatar from "./Avatar.vue";
import {GroupData, UserData} from "../utils/structs.ts";
import {isAdmin} from "../utils/grouprole.ts";
import GroupAdministration from "./GroupAdministration.vue";
import {callSnackbar} from "../utils/snackbar.ts";
import GroupSearchMessage from "./GroupSearchMessage.vue";
import Alert from "./Alert.vue";


const props = defineProps<{ contactId: number }>();
defineEmits(["accept", "reject", "apply", "displayProfile"]);

const groupAddMemberDialog = ref(false);

const deleteConfirmDialog = ref<boolean>(false);
const changeOwnerDialog = ref<boolean>(false);
const dismissConfirmDialog = ref<boolean>(false);
const groupAdministrationDialog = ref<boolean>(false);

watch(props, () => getUser(props.contactId, true));

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
      blockFriend(displayContactInfo.value.id);
    } else {
      unblockFriend(displayContactInfo.value.id);
    }
  },
})

const router = useRouter();

const memberInfoTable = computed(() => {
  const group = displayContactInfo.value as GroupData;
  const members = group.members;
  const admin = group.admin;
  const owner = group.owner;
  const result = [];
  result.push(owner);
  for (const i of admin) {
    if (i !== owner) {
      result.push(i);
    }
  }
  for (const i of members) {
    if (i !== owner && !admin.includes(i)) {
      result.push(i);
    }
  }
  return result;
});

const handleDelete = () => {
  if (!displayContactInfo.value || displayContactInfo.value.category === '') {
    return;
  }
  deleteConfirmDialog.value = false;
  if (displayContactInfo.value.category === 'user') {
    deleteFriend(displayContactInfo.value.id);
  } else {
    const group = displayContactInfo.value as GroupData;
    if (group.owner === userId.value && group.members.length > 1) {
      callSnackbar('You are the current group owner. Determine a new owner before leaving. ', 'red');
    } else {
      exitGroup(displayContactInfo.value.id);
    }
  }
};

const handleDismiss = () => {
  dismissConfirmDialog.value = false;
  dismissGroup(displayContactInfo.value.id);
}

const handleApplyFriend = (friendId: number) => {
  applyFriend(friendId);
  callSnackbar('Application sent.', 'green');
};

const displayContactInfo = computed(() => getUser(props.contactId));

const confirmDialog = ref<boolean>(false);
const confirmDialogText = ref<string>('');
const confirmDialogConfirm = ref<() => void>(() => {
});
const handleKickMember = (memberId: number) => {
  confirmDialog.value = true;
  confirmDialogText.value = 'Are you sure you want to kick this member?';
  confirmDialogConfirm.value = () => {
    confirmDialog.value = false;
    removeGroupMember(displayContactInfo.value.id, memberId);
  }
}

const handleAddAdmin = (memberId: number) => {
  confirmDialog.value = true;
  confirmDialogText.value = "Are you sure you want to set this member as an administrator?";
  confirmDialogConfirm.value = () => {
    confirmDialog.value = false;
    groupAddAdmin(displayContactInfo.value.id, memberId);
  }
}

const handleRemoveAdmin = (memberId: number) => {
  confirmDialog.value = true;
  confirmDialogText.value = "Are you sure you want to remove this member's rights of administrators?";
  confirmDialogConfirm.value = () => {
    confirmDialog.value = false;
    groupRemoveAdmin(displayContactInfo.value.id, memberId);
  }
}

const handleAcceptFriend = () => {
  const id = displayContactInfo.value.id;
  acceptFriend(id);
  activeContactId.value = id;
  contactPageProfileSource.value = 'contactList';
}

const handleRejectFriend = () => {
  const id = displayContactInfo.value.id;
  rejectFriend(id);
  activeRequestId.value = 0;
}

const handleAddMember = (list: Array<number>) => {
  groupAddMember(displayContactInfo.value.id, list.filter(i => !(displayContactInfo.value as GroupData).members.includes(i)));
  groupAddMemberDialog.value = false;
}

const handleChat = async () => {
  activeChatId.value = displayContactInfo.value.id;
  router.replace('chat').then();
  floatingContactId.value = 0;
  showProfileDialog.value = false;
};

const groupInfo = computed(() => {
  return displayContactInfo.value as GroupData;
})

const renameDialog = ref<boolean>(false);
const renameInputValue = ref<string>('');
const handleRename = () => {
  changeGroupName(displayContactInfo.value.id, renameInputValue.value);
  renameDialog.value = false;
}

const searchMessageDialog = ref<boolean>(false);

const tagsIn = computed(() => {
  if (displayContactInfo.value.category !== 'user') {
    return [];
  }
  if (!settings.value.tags) {
    settings.value.tags = {};
  }
  const list = [];
  for (const tag of Object.keys(settings.value.tags)) {
    if (settings.value.tags[tag].includes(displayContactInfo.value.id)) {
      list.push(tag);
    }
  }
  return list;
})

</script>

<template>
  <v-card class="mb-auto mt-6 overflow-y-auto justify-center" style="min-width: 23vw" v-if="displayContactInfo.id > 0"
          variant="flat">
    <v-card-item class="overflow-y-auto justify-center">
      <Avatar
          :display-big-avatar="true"
          :contact-id="displayContactInfo.id"
          class="justify-center mt-2"
      />
    </v-card-item>
    <v-card-item class="overflow-y-auto justify-center text-center">
      <v-list class="overflow-y-auto justify-center">
        <v-list-item-title class="justify-center">
          {{ displayContactInfo.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="justify-center"> @{{ displayContactInfo ? displayContactInfo.id : '' }}
        </v-list-item-subtitle>
        <v-list-item
            v-if="displayContactInfo && displayContactInfo.category === 'user'"
            class="text-grey-darken-3"
        >
          <v-divider class="ma-4"></v-divider>
          <v-list-item-title style="font-weight: 700" v-if="tagsIn.length" class="ma-4">
            Tags containing {{ displayContactInfo.name }}
          </v-list-item-title>
          <Tag v-for="tag in tagsIn" :name="tag"></Tag>
          <v-divider class="ma-4" v-if="tagsIn.length"/>
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
              <template #content>
                {{ (displayContactInfo as UserData).email ? (displayContactInfo as UserData).email : '' }}
              </template>
            </ProfileRow>
          </div>
        </v-list-item>
        <div
            v-if="displayContactInfo && displayContactInfo.category === 'group'"
            class="overflow-y-auto fill-height"
        >
          <v-divider class="ma-4"/>
          <v-card-title class="ma-7">Members</v-card-title>
          <div class="overflow-y-auto fill-height d-flex flex-wrap align-items-start member-container">
            <div
                v-for="member in memberInfoTable"
                :key="member"
                class="d-flex flex-column align-center member-item member-pop"
            >

              <Avatar
                  :display-big-avatar="false"
                  :contact-id="member"
                  size="60"
                  style="position: relative"
                  :style="groupInfo.owner === member ? 'border: #008eff 4px double' : groupInfo.admin.includes(member) ? 'border: #008eff 2px solid' : '' "
                  @click="floatingContactId=member; showProfileDialog=true"
              />
              <div class="badge-kick"
                   v-if="groupInfo.owner === userId && member !== userId || groupInfo.admin.includes(userId) && member !== userId && member !== groupInfo.owner && !groupInfo.admin.includes(member)"
                   @click="handleKickMember(member)">——
              </div>
              <p class="member-name">
                {{
                  (() => {
                    member;
                    return getUser(member).name;
                  })()
                }}
              </p>
              <div class="badge-lift"
                   v-if="groupInfo.owner === userId && member !== userId && !groupInfo.admin.includes(member)"
                   @click="handleAddAdmin(member)">|
              </div>
              <div class="badge-fire"
                   v-if="groupInfo.owner === userId && member !== userId && groupInfo.admin.includes(member)"
                   @click="handleRemoveAdmin(member)">*
              </div>
            </div>
            <div class="d-flex flex-column align-center member-item">
              <v-avatar size="60" color="indigo" @click="groupAddMemberDialog=true">
                <v-icon style="font-size: 35px"
                >mdi-account-multiple-plus
                </v-icon>
              </v-avatar>
              <p class="member-name">...</p>
            </div>
          </div>
        </div>
      </v-list>
      <v-divider class="ma-4"/>
      <v-col>
        <v-row v-if="displayContactInfo.id !== user.id && contacts.includes(displayContactInfo.id)"
               style="display: flex; align-items: center" class="ma-1">
          <p style="flex: 1" class="text-right pr-4">Pin:</p>
          <v-switch
              style="flex: 2"
              hide-details
              color="indigo"
              v-model="switchValuePin"
          ></v-switch>
        </v-row>
        <v-row v-if="displayContactInfo.id !== user.id && contacts.includes(displayContactInfo.id)"
               style="display: flex; align-items: center" class="ma-1">
          <p style="flex: 1" class="text-right pr-4">Mute:</p>
          <v-switch
              style="flex: 2"
              hide-details
              color="indigo"
              v-model="switchValueMute"
          ></v-switch>
        </v-row>
        <v-row style="display: flex; align-items: center" class="ma-1" v-if="displayContactInfo.category === 'user' && displayContactInfo.id !== user.id">
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
              v-if="contacts.includes(displayContactInfo.id) && (currentPage !== 'chat' || activeChatId !== displayContactInfo.id)"
              @click="handleChat" color="green">
            Chat
          </v-btn>
          <v-btn v-if="contacts.includes(displayContactInfo.id) && isAdmin(user.id, displayContactInfo.id)"
                 @click="groupAdministrationDialog=true"
                 color="indigo"
          >
            <div class="badge" v-if="candidatesList[displayContactInfo.id]?.length">{{ candidatesList[displayContactInfo.id]?.length }}</div>
            Administration
          </v-btn>
          <v-btn color="green" v-if="requests.includes(displayContactInfo.id)" @click="handleAcceptFriend">Accept
          </v-btn>
          <v-btn color="error" v-if="requests.includes(displayContactInfo.id)" @click="handleRejectFriend">Reject
          </v-btn>
          <v-btn
              v-if="!contacts.includes(displayContactInfo.id) && displayContactInfo.id !== user.id && !requests.includes(displayContactInfo.id)"
              color="blue" @click="handleApplyFriend(displayContactInfo.id)">Apply
          </v-btn>
          <v-btn v-if="displayContactInfo.id === user.id" color="primary"
                 @click="showProfileDialog = false; router.push('/profile')">Goto
            Profile
          </v-btn>
          <slot name="buttons"/>
          <v-btn color="error" v-if="contacts.includes(displayContactInfo.id) && displayContactInfo.id !== user.id"
                 @click="deleteConfirmDialog=true">Delete
          </v-btn>
        </div>
      </v-card-actions>
    </v-card-item>

    <Alert v-model:show-dialog="deleteConfirmDialog" @confirm="handleDelete" title="Are you sure?"
           :content="'Are you sure you want to ' + (displayContactInfo.category === 'group'?'quit the group?':'delete the contact?')"
           :irreversible="true"/>
    <Alert v-model:show-dialog="dismissConfirmDialog" @confirm="handleDismiss" title="Are you sure?"
           content="Are you sure you want to dismiss the group?" :irreversible="true"/>
    <v-dialog v-model="renameDialog" max-width="30vw" max-height="80vh">
      <v-card class="fill-height overflow-y-auto">
        <v-card-title>Rename</v-card-title>
        <v-card-text>
          <v-text-field :autofocus="true" v-model="renameInputValue"></v-text-field>
        </v-card-text>
        <v-card-actions class="mb-3 mr-4">
          <v-spacer></v-spacer>
          <v-btn color="info" @click="handleRename">Confirm</v-btn>
          <v-btn color="error" @click="renameInputValue=''; renameDialog=false;">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SelectMember
        v-model:show-dialog="groupAddMemberDialog"
        :pinned="groupInfo.members"
        :possible="userContacts"
        :title="'Add Member'"
        :base-group="displayContactInfo"
        @confirm="handleAddMember"
        tags
    />
    <SelectMember
        v-model:show-dialog="changeOwnerDialog"
        :single="true"
        title="Change Ownership"
        :possible="groupInfo.members"
        :pinned="[]"
        @confirm="(target, _) => {
          changeOwnerDialog = false;
          groupChangeOwner(displayContactInfo.id, target);
        }"
    />
    <GroupAdministration
        v-model:show-dialog="groupAdministrationDialog"
        v-if="displayContactInfo.category === 'group'"
        :group-id="displayContactInfo.id"
        @change-ownership="changeOwnerDialog=true; groupAdministrationDialog=false;"
        @dismiss-group="dismissConfirmDialog=true; groupAdministrationDialog=false;"
        @rename-group="renameDialog=true; groupAdministrationDialog=false;"
    />
    <Alert v-model:show-dialog="confirmDialog" @confirm="confirmDialogConfirm" :content="confirmDialogText"
           title="Are you sure?"/>
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
  line-height: 10px;
  font-size: 12px;
  color: white;
  background-color: red;
  cursor: pointer;
}

.badge-lift {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  position: absolute;
  right: 0;
  top: 16px;
  line-height: 10px;
  font-size: 12px;
  color: white;
  background-color: dodgerblue;
  cursor: pointer;
}

.badge-fire {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  position: absolute;
  right: 0;
  top: 16px;
  line-height: 10px;
  font-size: 12px;
  color: white;
  background-color: grey;
  cursor: pointer;
}

.v-btn {
  font-size: 15px;
  font-weight: bold;
}

.member-name {
  max-width: 60px; /* 设置最大宽度 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}

.member-container {
  justify-content: flex-start; /* 保证头像靠左排列 */
}

.member-item {
  margin-right: 10px; /* 设置头像之间的间隔 */
}

.badge {
  position: absolute;
  height: 16px;
  width: 16px;
  line-height: 16px;
  right: -1.2em;
  font-size: 0.56em;
  z-index: 10000;
  background-color: red;
  border-radius: 7px;
  color: white;
  text-align: center;
  font-weight: 700;
}

</style>

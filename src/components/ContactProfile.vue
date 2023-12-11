<script setup lang="ts">
import {computed, ref, watch} from "vue";
import ProfileRow from "./ProfileRow.vue";
import SelectMember from "./SelectMember.vue";
import {
  activeChatId,
  activeContactId,
  activeRequestId,
  blacklist,
  contactPageProfileSource,
  contacts,
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
  changeGroupName, dismissGroup,
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


const props = defineProps<{ contactId: number }>();
defineEmits(["accept", "reject", "apply", "displayProfile"]);

const groupAddMemberDialog = ref(false);

const deleteConfirmDialog = ref<boolean>(false);
const changeOwnerDialog = ref<boolean>(false);
const dismissConfirmDialog = ref<boolean>(false);

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
      settings.value.blocked.push(displayContactInfo.value.id);
      blockFriend(displayContactInfo.value.id);
    } else {
      settings.value.blocked = settings.value.blocked.filter(id => id !== displayContactInfo.value.id);
      unblockFriend(displayContactInfo.value.id);
    }
  },
})

const router = useRouter();

const memberInfoTable = computed(() => {
  return (displayContactInfo.value as GroupData).members;
})

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
      alert('不许退群！成年人要学会负责任，你作为群主退群让其他群成员咋办？起码指定一个接班人再说！')
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
  alert("喜报：你发送了申请！\nGood news! You sent an application! ");
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
}
</script>

<template>
  <v-card class="mb-auto mt-6 overflow-y-auto justify-center" v-if="displayContactInfo.id > 0">
    <v-card-item class="overflow-y-auto justify-center">
      <Avatar :display-big-avatar="true" :contact-id="displayContactInfo.id" class="justify-center"></Avatar>
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
          <div class="overflow-y-auto fill-height d-flex flex-wrap">
            <div
                v-for="member in memberInfoTable"
                :key="member"
                class="d-flex flex-column align-center ma-auto mb-5 pt-4 member-pop"
            >

              <Avatar
                  :display-big-avatar="false"
                  :contact-id="member"
                  size="60"
                  style="position: relative"
                  :style="groupInfo.owner === member ? 'border: #008eff 4px double' : groupInfo.admin.includes(member) ? 'border: #008eff 2px solid' : '' "
                  @click="$emit('displayProfile', member)"
              />
              <div class="badge-kick"
                   v-if="groupInfo.owner === userId && member !== userId || groupInfo.admin.includes(userId) && member !== userId && member !== groupInfo.owner && !groupInfo.admin.includes(member)"
                   @click="handleKickMember(member)">——
              </div>
              <p>{{
                  (() => {
                    member;
                    return getUser(member).name;
                  })()
                }}</p>
              <div class="badge-lift"
                   v-if="groupInfo.owner === userId && member !== userId && !groupInfo.admin.includes(member)"
                   @click="handleAddAdmin(member)">|
              </div>
              <div class="badge-fire"
                   v-if="groupInfo.owner === userId && member !== userId && groupInfo.admin.includes(member)"
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
        <v-row style="display: flex; align-items: center" class="ma-1" v-if="displayContactInfo.category === 'user'">
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
          <v-btn v-if="contacts.includes(displayContactInfo.id) && activeChatId !== displayContactInfo.id"
                 @click="handleChat" color="green">
            Chat
          </v-btn>
          <v-btn
              v-if="displayContactInfo.category === 'group' && groupInfo.owner === user.id"
              color="primary"
              @click="changeOwnerDialog=true"
          >Change Ownership
          </v-btn>
          <v-btn
              v-if="displayContactInfo.category === 'group' && groupInfo.owner === user.id"
              color="indigo"
              @click="changeOwnerDialog=true"
          >Rename Group
          </v-btn>
          <v-btn color="green" v-if="requests.includes(displayContactInfo.id)" @click="handleAcceptFriend">Accept
          </v-btn>
          <v-btn color="error" v-if="requests.includes(displayContactInfo.id)" @click="handleRejectFriend">Reject
          </v-btn>
          <v-btn
              v-if="!contacts.includes(displayContactInfo.id) && displayContactInfo.id !== user.id && !requests.includes(displayContactInfo.id)"
              color="blue" @click="handleApplyFriend(displayContactInfo.id)">Apply
          </v-btn>
          <v-btn v-if="displayContactInfo.id === user.id" color="primary" @click="router.push('/profile')">Goto
            Profile
          </v-btn>
          <slot name="buttons"/>
          <v-btn color="error" v-if="contacts.includes(displayContactInfo.id) && displayContactInfo.id !== user.id"
                 @click="deleteConfirmDialog=true">Delete
          </v-btn>
          <v-btn color="red-darken-4" v-if="displayContactInfo.category === 'group' && (displayContactInfo as GroupData).owner === user.id"
                 @click="dismissConfirmDialog=true">Dismiss
          </v-btn>
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
    <v-dialog v-model="dismissConfirmDialog" max-width="30vw">
      <v-card>
        <v-alert
            type="warning"
            title="Are you sure to dismiss the group?"
            text="This operation cannot be undone."
        ></v-alert>
        <v-card-actions class="justify-end">
          <v-btn @click="dismissConfirmDialog = false">cancel</v-btn>
          <v-btn @click="handleDismiss">Dismiss</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="renameDialog" max-width="30vw" max-height="80vh">
      <v-card class="fill-height overflow-y-auto">
        <v-card-title>Rename</v-card-title>
        <v-card-text>
          <v-text-field autofocus v-model="renameInputValue"></v-text-field>
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

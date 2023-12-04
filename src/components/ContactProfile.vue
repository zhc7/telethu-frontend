<script setup lang="ts">
import {computed, ref, watch} from "vue";
import ProfileRow from "./ProfileRow.vue";
import SelectMember from "./SelectMember.vue";
import {
  activeChatId,
  activeContactId,
  requests,
  selectedChatInfo,
  selectedContactInfo,
  settings,
  user,
  userAvatar,
  userEmail,
  userId,
  userName
} from "../globals.ts";
import {useRouter} from "vue-router";
import {getUser} from "../core/data.ts";
import {GroupData} from "../utils/structs.ts";
import {exitGroup, groupAddAdmin, groupRemoveAdmin, removeGroupMember} from "../core/groups/send.ts";
import {blockFriend, deleteFriend, unblockFriend} from "../core/users/send.ts";
import Avatar from "./Avatar.vue";


const props = defineProps(['source']);
defineEmits(["accept", "reject", "apply"]);

const groupAddMemberDialog = ref(false);

const deleteConfirmDialog = ref(false);

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
    return settings.value.blocked.includes(displayContactInfo.value.id);
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

const ifGroup = computed(() => {
  return displayContactInfo.value && displayContactInfo.value.category === "group";
});

const memberInfoTable = ref<Array<{
  id: number,
  name: string,
  time: number,
  avatar: string,
  role: number,
}>>([]);

const handleDelete = () => {
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

const handleChat = async () => {
  activeChatId.value = activeContactId.value;
  router.replace('chat');
}

const handleChangeOwner = () => {
  alert('change owner');
}

const editName = () => {
  console.log("editName");
};

const displayContactInfo = computed(() => {
  if (props.source === 'chatPage') {
    if (selectedChatInfo.value !== undefined) {
      return selectedChatInfo.value;
    }
    return {
      id: 0,
      name: 'Loading...',
      email: 'Loading...',
      avatar: '/Logo.png',
      category: 'temp',
    }
  } else if (props.source === 'contactList' || props.source === 'requestList' || props.source === 'searchResult') {
    if (selectedContactInfo.value !== undefined) {
      return selectedContactInfo.value;
    }
    return {
      id: 0,
      name: 'Loading...',
      email: 'Loading...',
      avatar: '/Logo.png',
      category: 'temp',
    }
  }
  return {
    id: userId.value,
    name: userName.value,
    email: userEmail.value,
    avatar: userAvatar.value,
    category: 'self',
  }
});

watch(displayContactInfo, (newInfo: GroupData) => {
  if (!newInfo || !newInfo || newInfo.category !== 'group') return;
  const members = newInfo.members;
  memberInfoTable.value = [];
  for (const id of members) {
    const index = memberInfoTable.value.length;
    const owner = newInfo.owner;
    const admin = newInfo.admin;
    memberInfoTable.value.push({
      id: id,
      name: 'Loading...',
      avatar: '',
      time: Date.now(),
      role: 0,
    });
    const info = getUser(id);
    memberInfoTable.value[index] ={
      id: info.id,
      name: info.name,
      avatar: info.avatar,
      time: Date.now(),
      role: 0,
    }
  }
}, {immediate: true});

const handleKickMember = (memberId: number) => {
  removeGroupMember(displayContactInfo.value.id, memberId);
}

const handleAddAdmin = (memberId: number) => {
  groupAddAdmin(displayContactInfo.value.id, memberId);
}

const handleRemoveAdmin = (memberId: number) => {
  groupRemoveAdmin(displayContactInfo.value.id, memberId);
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
              <template #content> {{ displayContactInfo.email ? displayContactInfo.email : '' }}</template>
            </ProfileRow>
          </div>
        </v-list-item>
        <div
            v-if="displayContactInfo && displayContactInfo.category === 'group'"
            class="overflow-y-auto fill-height"
        >
          <v-divider class="ma-4"/>
          <v-card-title class="ma-7"> Members</v-card-title>
          <div class="overflow-y-auto fill-height d-flex flex-wrap">
            <div
                v-for="member in memberInfoTable"
                :key="member.id"
                class="d-flex flex-column align-center ma-auto mb-5 pt-4 member-pop"
            >

              <Avatar
                  :contact-id="member.id"
                  size="60"
                  style="position: relative"
                  :style="displayContactInfo.owner === member.id ? 'border: #008eff 4px double' : displayContactInfo.admin.includes(member.id) ? 'border: #008eff 2px solid' : '' "
              />
              <div class="badge-kick"
                   v-if="displayContactInfo.owner === userId && member.id !== userId || displayContactInfo.admin.includes(userId) && member.id !== userId && member.id !== displayContactInfo.owner && !displayContactInfo.admin.includes(member.id)"
                   @click="handleKickMember(member.id)">——
              </div>
              <p>{{ member.name }}</p>
              <div class="badge-lift"
                   v-if="displayContactInfo.owner === userId && member.id !== userId && !displayContactInfo.admin.includes(member.id)"
                   @click="handleAddAdmin(member.id)">|
              </div>
              <div class="badge-fire"
                   v-if="displayContactInfo.owner === userId && member.id !== userId && displayContactInfo.admin.includes(member.id)"
                   @click="handleRemoveAdmin(member.id)">*
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
      <!--      <v-col v-if="displayContactInfo.id !== user.id">-->
      <!--&lt;!&ndash;        <v-row style="display: flex; align-items: center;" class="ma-3">&ndash;&gt;-->
      <!--&lt;!&ndash;          &lt;!&ndash; TODO: add rename function &ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;          <p style="flex: 1" class="text-right pr-4">Rename:</p>&ndash;&gt;-->
      <!--&lt;!&ndash;          <v-text-field&ndash;&gt;-->
      <!--&lt;!&ndash;              variant="outlined"&ndash;&gt;-->
      <!--&lt;!&ndash;              label="New name"&ndash;&gt;-->
      <!--&lt;!&ndash;              density="compact"&ndash;&gt;-->
      <!--&lt;!&ndash;              style="flex: 2"&ndash;&gt;-->
      <!--&lt;!&ndash;              hide-details&ndash;&gt;-->
      <!--&lt;!&ndash;              append-inner-icon="mdi-pencil"&ndash;&gt;-->
      <!--&lt;!&ndash;          />&ndash;&gt;-->
      <!--&lt;!&ndash;          v-model="newName"&ndash;&gt;-->
      <!--&lt;!&ndash;          @click:append-inner="editName"&ndash;&gt;-->
      <!--&lt;!&ndash;        </v-row>&ndash;&gt;-->
      <!--&lt;!&ndash;        <v-row&ndash;&gt;-->
      <!--&lt;!&ndash;            style="display: flex; align-items: center"&ndash;&gt;-->
      <!--&lt;!&ndash;            class="ma-3 text-right"&ndash;&gt;-->
      <!--&lt;!&ndash;        >&ndash;&gt;-->
      <!--          &lt;!&ndash; TODO: add friend circle function &ndash;&gt;-->
      <!--&lt;!&ndash;          <p style="flex: 1" class="pr-4">Label:</p>&ndash;&gt;-->
      <!--&lt;!&ndash;          <v-combobox&ndash;&gt;-->
      <!--&lt;!&ndash;              v-model="friendCircleSelect"&ndash;&gt;-->
      <!--&lt;!&ndash;              chips&ndash;&gt;-->
      <!--&lt;!&ndash;              :items="friendCircle"&ndash;&gt;-->
      <!--&lt;!&ndash;              multiple&ndash;&gt;-->
      <!--&lt;!&ndash;              variant="outlined"&ndash;&gt;-->
      <!--&lt;!&ndash;              density="compact"&ndash;&gt;-->
      <!--&lt;!&ndash;              hide-details&ndash;&gt;-->
      <!--&lt;!&ndash;              style="flex: 2"&ndash;&gt;-->
      <!--&lt;!&ndash;          ></v-combobox>&ndash;&gt;-->
      <!--&lt;!&ndash;        </v-row>&ndash;&gt;-->
      <!--&lt;!&ndash;        <v-row&ndash;&gt;-->
      <!--&lt;!&ndash;            style="display: flex; align-items: center"&ndash;&gt;-->
      <!--&lt;!&ndash;            class="ma-1 text-right"&ndash;&gt;-->
      <!--&lt;!&ndash;        >&ndash;&gt;-->
      <v-card-actions>
        <v-col v-if="source === 'contactList'">
          <v-row v-if="displayContactInfo && displayContactInfo.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="green"
                style="font-size: 15px; font-weight: bold"
                @click="handleChat"
            >Chat
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo && displayContactInfo.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn color="indigo" style="font-size: 15px; font-weight: bold"
            >Recommend
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo.info && displayContactInfo.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="error"
                style="font-size: 15px; font-weight: bold"
                @click="deleteConfirmDialog = true"
            >Delete Friend
            </v-btn>
          </v-row>
          <v-row
              v-if="displayContactInfo && displayContactInfo.category === 'group' && displayContactInfo.owner === userId"
              style="display: flex; justify-content: center">
            <v-btn
                color="info"
                style="font-size: 15px; font-weight: bold"
                @click="alert('change')"
            >Change Owner
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo && displayContactInfo.category === 'group'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="error"
                style="font-size: 15px; font-weight: bold"
                @click="deleteConfirmDialog = true"
            >Quit Group
            </v-btn>
          </v-row>
        </v-col>
        <v-col v-if="source === 'requestList' && requests.includes(displayContactInfo.id)">
          <v-btn color="blue" style="font-size: 15px; font-weight: bold"
                 @click="$emit('accept', displayContactInfo.id)">Accept
          </v-btn>
          <v-btn color="error" style="font-size: 15px; font-weight: bold"
                 @click="$emit('reject', displayContactInfo.id)">Reject
          </v-btn>
        </v-col>
        <v-col v-if="source === 'searchResult'">
          <v-btn color="blue" style="font-size: 15px; font-weight: bold"
                 @click="$emit('apply', displayContactInfo.id)">Apply
          </v-btn>
        </v-col>
        <v-col v-if="source === 'chatPage'">
          <v-row v-if="displayContactInfo && displayContactInfo.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="indigo" style="font-size: 15px; font-weight: bold"
            >Recommend
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo && displayContactInfo.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="error"
                style="font-size: 15px; font-weight: bold"
                @click="deleteConfirmDialog = true"
            >Delete Friend
            </v-btn>
          </v-row>
          <v-row
              v-if="displayContactInfo && displayContactInfo.category === 'group' && displayContactInfo.owner === userId"
              style="display: flex; justify-content: center">
            <v-btn
                color="info"
                style="font-size: 15px; font-weight: bold"
                @click="handleChangeOwner"
            >Change Owner
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo && displayContactInfo.category === 'group'"
                 style="display: flex; justify-content: center">
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
          <v-btn @click="deleteConfirmDialog = false">cancel</v-btn>
          <v-btn @click="handleDelete">delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <SelectMember
        :showDialog="groupAddMemberDialog"
        @update:showDialog="groupAddMemberDialog = $event"
        source="existingGroup"
        :title="'Add Member'"
        :base-group="displayContactInfo"
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


</style>

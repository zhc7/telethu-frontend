<script setup lang="ts">
import {blockFriend, deleteFriend, exitGroup, kickMember, unblockFriend,} from "../core/chat.ts";
import {computed, ref, watch} from "vue";
import ProfileRow from "./ProfileRow.vue";
import SelectMember from "./SelectMember.vue";
import {
  activeChatId,
  activeContactId,
  selectedChatInfo,
  selectedContactInfo,
  settings,
  userAvatar,
  userEmail,
  userId,
  userName
} from "../globals.ts";
import {useRouter} from "vue-router";
import {getAvatarOrDefault, getUser} from "../core/data.ts";
import {GroupData} from "../utils/structs.ts";


const props = defineProps(['source']);
defineEmits(["accept", "reject", "apply"]);

const groupAddMemberDialog = ref(false);

const deleteConfirmDialog = ref(false);

const switchValueMute = computed<boolean>({
  get: () => {
    return settings.value.muted.includes(props.displayContact.id);
  },
  set: (value) => {
    if (!selectedChatInfo.value) {
      return;
    }
    if (value) {
      settings.value.muted.push(selectedChatInfo.value.id);
    } else {
      const selId = selectedChatInfo.value.id;
      settings.value.muted = settings.value.muted.filter((id) => {
        return id !== selId;
      });
    }
  },
})

const switchValuePin = computed<boolean>({
  get: () => {
    return settings.value.pinned.includes(props.displayContact.id);
  },
  set: (value) => {
    if (value) {
      settings.value.pinned.push(props.displayContact.id);
    } else {
      settings.value.pinned = settings.value.pinned.filter((id) => {
        return id !== props.displayContact.id;
      });
    }
  },
})

const switchValueBlock = computed<boolean>({
  get: () => {
    return settings.value.blocked.includes(props.displayContact.id);
  },
  set: (value) => {
    if (value) {
      settings.value.blocked.push(props.displayContact.id);
      blockFriend(props.displayContact.id);
    } else {
      settings.value.blocked = settings.value.blocked.filter((id) => {
        return id !== props.displayContact.id;
      });
      unblockFriend(props.displayContact.id);
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
    exitGroup(displayContactInfo.value.id);
  }
};

const handleChat = async () => {
  activeChatId.value = activeContactId.value;
  router.replace('chat');
}

const editName = () => {
  console.log("editName");
};

const displayContactInfo = computed(() => {
  if (props.source === 'chatPage') {
    if (selectedChatInfo.value !== undefined) {
      return selectedChatInfo.value;
    }
  } else if (props.source === 'contactList' || props.source === 'requestList' || props.source === 'searchResult') {
    if (selectedContactInfo.value !== undefined)
      return selectedContactInfo.value;
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
    getUser(id).then((info) => {
      memberInfoTable.value[index] = {
        id: info.id,
        name: info.name,
        avatar: info.avatar,
        time: Date.now(),
        role: 0,
      }
      // memberInfoTable.value.sort((a, b) => {
      //   if (a.id < 1) return 1;
      //   if (b.id < 1) return -1;
      //   if (a.id === owner) return 1;
      //   if (b.id === owner) return -1;
      //   if (admin.includes(a.id)) {
      //     if (admin.includes(b.id)) {
      //       return members.indexOf(a.id) - members.indexOf(b.id);
      //     }
      //     return -1;
      //   }
      //   if (admin.includes(b.id)) {
      //     return 1;
      //   }
      //   return members.indexOf(a.id) - members.indexOf(b.id);
      // })
    });
  }
})

const handleKickMember = (memberId: number) => {
  kickMember(displayContactInfo.value.id, memberId);
}


</script>

<template>
  <v-card class="mb-auto mt-6 overflow-y-auto" v-if="displayContactInfo">
    <v-avatar size="80" class="mt-5">
      <v-img :src="getAvatarOrDefault(displayContactInfo.avatar)" cover/>
    </v-avatar>
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
                class="d-flex flex-column align-center ma-auto mb-5 pt-4"
            >
              <v-badge color="red" content="-"
                       v-if="displayContactInfo.owner === userId && member.id !== userId || displayContactInfo.admin.includes(userId) && member.id !== userId && member.id !== displayContactInfo.owner && !displayContactInfo.admin.includes(member.id)"
                       @click="handleKickMember(member.id)">
                <v-avatar size="60" style="position: relative"
                          :style="displayContactInfo.owner === member.id ? 'border: #008eff 4px double' : displayContactInfo.admin.includes(member.id) ? 'border: #008eff 1px solid' : '' ">
                  <v-img :src="getAvatarOrDefault(member.avatar)" id="member-avatar" cover/>
                </v-avatar>
              </v-badge>
              <v-avatar v-else size="60" style="position: relative"
                        :style="displayContactInfo.owner === member.id ? 'border: #008eff 4px double' : displayContactInfo.admin.includes(member.id) ? 'border: #008eff 1px solid' : '' ">
                <v-img :src="getAvatarOrDefault(member.avatar)" id="member-avatar" cover/>
              </v-avatar>
              <p>{{ member.name }}</p>
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
      <v-col v-if="false">
        <v-row style="display: flex; align-items: center;" class="ma-3">
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
          ></v-switch>
        </v-row>
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
          <p style="flex: 1" class="text-right pr-4">Block:</p>
          <v-switch
              style="flex: 2"
              hide-details
              color="error"
              v-model="switchValueBlock"
          ></v-switch>
        </v-row>
        <v-divider class="mt-4"/>
      </v-col>
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
        <v-col v-if="source === 'requestList'">
          <v-btn color="blue" style="font-size: 15px; font-weight: bold"
                 @click="$emit('accept', displayContactInfo.id)">Pass
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
        :base-group="displayContactInfo.members"
    />
  </v-card>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>

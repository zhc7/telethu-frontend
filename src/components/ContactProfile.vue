<script setup lang="ts">
import {blockFriend, deleteFriend, exitGroup, unblockFriend,} from "../core/chat.ts";
import {computed, ref} from "vue";
import ProfileRow from "./ProfileRow.vue";
import SelectMember from "./SelectMember.vue";
import {
  activeChatId,
  activeContactId,
  currentPage,
  selectedChatInfo,
  selectedContactInfo,
  settings, userAvatar, userEmail, userId, userName
} from "../globals.ts";
import {useRouter} from "vue-router";

defineEmits(["accept", "reject", "apply"]);

const groupAddMemberDialog = ref(false);

const deleteConfirmDialog = ref(false);

const switchValueMute = computed<boolean>({
  get: () => {
    return settings.value.muted.includes(props.displayContact.id);
  },
  set: (value) => {
    if (value) {
      settings.value.muted.push(props.displayContact.id);
    } else {
      settings.value.muted = settings.value.muted.filter((id) => {
        return id !== props.displayContact.id;
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
  return props.displayContact && props.displayContact.category === "group";
});

const memberInfoTable = ref({});

const handleDelete = () => {
  deleteConfirmDialog.value = false;
  if (props.displayContact.category === 'user') {
    deleteFriend(props.displayContact.id);
  } else {
    exitGroup(props.displayContact.id);
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
  if (currentPage.value === 'chat') {
    return selectedChatInfo.value;
  } else if (currentPage.value === 'contacts') {
    return selectedContactInfo.value;
  } else {
    return {
      info: {
        id: userId.value,
        name: userName.value,
        email: userEmail.value,
        avatar: userAvatar.value,
      }
    }
  }
})

</script>

<template>
  <v-card class="mb-auto mt-6 overflow-y-auto" v-show="displayContactInfo && displayContactInfo.source !== undefined && displayContactInfo.info !== undefined">
    <v-avatar size="80" class="mt-5">
      <v-img :src="'public/Logo.png'" cover/>
    </v-avatar>
    <v-card-item class="overflow-y-auto">
      <v-list class="overflow-y-auto">
        <v-list-item-title>
          {{ displayContactInfo.info ? displayContactInfo.info.name : '' }}
        </v-list-item-title>
        <v-list-item-subtitle> @{{ displayContactInfo.info ? displayContactInfo.info.id : '' }}</v-list-item-subtitle>
        <v-list-item
            v-if="displayContactInfo.info && displayContactInfo.info.category === 'user'"
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
            <ProfileRow v-show="displayContactInfo.info && displayContactInfo.info.category === 'user'">
              <template #title> Email:</template>
              <template #content> {{ displayContactInfo.info.email ? displayContactInfo.info.email : '' }}</template>
            </ProfileRow>
          </div>
        </v-list-item>
        <!--        <div-->
        <!--          v-if="displayContactInfo.info && displayContactInfo.info.category === 'group'"-->
        <!--          class="overflow-y-auto fill-height"-->
        <!--        >-->
        <!--          <v-divider class="ma-4" />-->
        <!--          <v-card-title class="ma-7"> Members </v-card-title>-->
        <!--          <div class="overflow-y-auto fill-height d-flex flex-wrap">-->
        <!--            <div-->
        <!--              v-for="member in (displayContact as GroupData).members"-->
        <!--              :key="member.id"-->
        <!--              class="d-flex flex-column align-center ma-auto mb-5"-->
        <!--            >-->
        <!--              <v-avatar size="60">-->
        <!--                <v-img :src="member.avatar" id="member-avatar" cover />-->
        <!--              </v-avatar>-->
        <!--              <p>{{  }}</p>-->
        <!--            </div>-->
        <!--            <div class="d-flex flex-column align-center ma-auto mb-5">-->
        <!--              <v-avatar size="60" color="indigo" @click="groupAddMemberDialog = true">-->
        <!--                <v-icon style="font-size: 35px"-->
        <!--                  >mdi-account-multiple-plus</v-icon-->
        <!--                >-->
        <!--              </v-avatar>-->
        <!--              <p class="text-indigo">...</p>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
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
        <v-col v-if="displayContactInfo.source === 'contactList'">
          <v-row v-if="displayContactInfo.info && displayContactInfo.info.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="green"
                style="font-size: 15px; font-weight: bold"
                @click="handleChat"
            >Chat
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo.info && displayContactInfo.info.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn color="indigo" style="font-size: 15px; font-weight: bold"
            >Recommend
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo.info && displayContactInfo.info.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="error"
                style="font-size: 15px; font-weight: bold"
                @click="deleteConfirmDialog = true"
            >Delete Friend
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo.info && displayContactInfo.info.category === 'group'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="error"
                style="font-size: 15px; font-weight: bold"
                @click="deleteConfirmDialog = true"
            >Quit Group
            </v-btn>
          </v-row>
        </v-col>
        <v-col v-if="displayContactInfo.source === 'requestList'">
          <v-btn color="blue" style="font-size: 15px; font-weight: bold"
                 @click="$emit('accept', displayContactInfo.info.id)">Pass
          </v-btn>
          <v-btn color="error" style="font-size: 15px; font-weight: bold"
                 @click="$emit('reject', displayContactInfo.info.id)">Reject
          </v-btn>
        </v-col>
        <v-col v-if="displayContactInfo.source === 'searchResult'">
          <v-btn color="blue" style="font-size: 15px; font-weight: bold"
                 @click="$emit('apply', displayContactInfo.info.id)">Apply
          </v-btn>
        </v-col>
        <v-col v-if="displayContactInfo.source === 'chatList'">
          <v-row v-if="displayContactInfo.info && displayContactInfo.info.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="indigo" style="font-size: 15px; font-weight: bold"
            >Recommend
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo.info && displayContactInfo.info.category === 'user'"
                 style="display: flex; justify-content: center">
            <v-btn
                color="error"
                style="font-size: 15px; font-weight: bold"
                @click="deleteConfirmDialog = true"
            >Delete Friend
            </v-btn>
          </v-row>
          <v-row v-if="displayContactInfo.info && displayContactInfo.info.category === 'group'"
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
        :type="'add_group_member'"
        :title="'Add Member'"
    />
  </v-card>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>

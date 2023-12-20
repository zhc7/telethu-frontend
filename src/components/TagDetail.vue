<script setup lang="ts">
import {computed, ref} from "vue";
import {
  activeTagName,
  floatingContactId,
  settings,
  showProfileDialog, tagAddMember,
  tagRemoveMember,
  userContacts
} from "../globals.ts";
import {getUser} from "../core/data.ts";
import Avatar from "./Avatar.vue";
import Alert from "./Alert.vue";
import SelectMember from "./SelectMember.vue";


const props = defineProps<{ tagName: string, allowImport: boolean }>();
defineEmits('imp');

const members = computed(() => {
  if (!settings.value.tags[props.tagName]) {
    return [];
  }
  return settings.value.tags[props.tagName];
});

const handleAddMember = (target: number []) => {
  tagAddMember(target, props.tagName);
  addMemberDialog.value = false;
}

const deleteTagDialog = ref<boolean>(false);
const addMemberDialog = ref<boolean>(false);

</script>

<template>
  <v-card class="mb-auto mt-6 overflow-y-auto justify-center" v-if="activeTagName" style="min-width: 23vw"
          variant="flat">
    <v-card-item class="overflow-y-auto justify-center">
      <v-icon>mdi-account-multiple</v-icon>
    </v-card-item>
    <v-card-item class="overflow-y-auto justify-center text-center">
      <v-list class="overflow-y-auto justify-center">
        <v-list-item-title class="justify-center">
          {{ tagName }}
        </v-list-item-title>
        <v-list-item-subtitle class="justify-center"> {{ members.length }} members in total
        </v-list-item-subtitle>
        <div
            class="overflow-y-auto fill-height"
        >
          <v-divider class="ma-4"/>
          <v-card-title class="ma-7">Members</v-card-title>
          <div class="overflow-y-auto fill-height d-flex flex-wrap align-items-start member-container">
            <div
                v-for="member in members"
                :key="member"
                class="d-flex flex-column align-center member-item member-pop"
            >

              <Avatar
                  :display-big-avatar="false"
                  :contact-id="member"
                  size="60"
                  style="position: relative"
                  @click="floatingContactId=member; showProfileDialog=true"
              />
              <div class="badge-remove"
                   @click="tagRemoveMember(member, tagName)">——
              </div>
              <p class="member-name">
                {{ getUser(member).name }}
              </p>
            </div>
          </div>
        </div>
      </v-list>
      <v-divider class="ma-4"/>
      <v-card-actions class="justify-center">
        <div class="d-flex flex-column">
          <v-btn
              @click="addMemberDialog=true" color="green">
            Add Member
          </v-btn>
          <v-btn
              @click="deleteTagDialog=true" color="error">
            Delete Tag
          </v-btn>
          <v-btn
            @click="$emit('imp')" color="indigo" v-if="allowImport">
            Import
          </v-btn>
        </div>
      </v-card-actions>
    </v-card-item>
    <SelectMember
        v-model:show-dialog="addMemberDialog"
        :possible="userContacts"
        :pinned="members"
        @confirm="handleAddMember"
    ></SelectMember>
    <Alert v-model:show-dialog="deleteTagDialog" @confirm="" title="Are you sure?"
           content="'Are you sure you want to delete the tag"
           :irreversible="true"/>
  </v-card>
</template>

<style scoped>

.member-pop {
  position: relative;
}

.badge-remove {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  position: absolute;
  z-index: 10000;
  right: 0;
  line-height: 10px;
  font-size: 12px;
  color: white;
  background-color: red;
  cursor: pointer;
}

.member-container {
  justify-content: center; /* 保证头像靠左排列 */
}

.v-btn {
  font-size: 15px;
  font-weight: bold;
}

</style>

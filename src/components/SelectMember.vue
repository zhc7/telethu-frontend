<script setup lang="ts">

import {computed, ref, watch} from "vue";
import {activeChatId, contacts, user, userId, users} from "../globals.ts";
import {createGroup, sendMessage} from "../core/users/send.ts";
import {groupAddMember} from "../core/groups/send.ts";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";

/**
 * source: chatList, personalFriend, existingGroup, share
 *
 */
const props = defineProps(['showDialog', 'title', 'contactId', 'source', 'sharedMessages', 'baseGroup']);
const emit = defineEmits(['update:showDialog', 'membersSelected']);
const createGroupName = ref('');

const pinedList = ref<Array<number>>([]);
const selectedList = ref<Array<number>>([]);

const pinedInfo = computed(() => {
  const retList = contacts.value.filter(id => pinedList.value.includes(id));
  if (pinedList.value.includes(user.value.id)) {
    retList.unshift(user.value.id);
  }
  return retList;
});

const selectedInfo = computed(() => {
  return contacts.value.filter((id) => {
    return selectedList.value.includes(id);
  })
})

const actSelect = (id: number) => {
  if (!selectedList.value.includes(id)) {
    selectedList.value.push(id);
  }
}
const actUnselect = (id: number) => {
  selectedList.value = selectedList.value.filter((i) => {
    return id !== i;
  })
}

const possibleMembers = computed(() => {
  return contacts.value.filter((id) => {
    return getUser(id).category === "user";
  })
});

const dialog = computed({
  get: () => props.showDialog,
  set: (value) => {
    emit('update:showDialog', value)
  }
});

watch(dialog, (newValue) => {
  if (newValue === false) {
    setTimeout(() => {
      pinedList.value = [];
      selectedList.value = [];
    }, 200);
    return;
  }
  if (props.source === 'personalFriend') {
    pinedList.value.push(activeChatId.value);
    pinedList.value.push(userId.value);
  } else if (props.source === 'existingGroup') {
    pinedList.value = props.baseGroup.members;
  } else if (props.source === 'chatList') {
    if (!pinedList.value.includes(userId.value)) {
      pinedList.value.push(userId.value);
    }
  }
});

const dispatchedMention = (names: Array<number>) => {
  emit('membersSelected', names);
  dialog.value = false;
}

const dispatchFunction = () => {
  console.log('source', props.source);
  const list = [];
  for (const member of pinedList.value) {
    list.push(member);
  }
  for (const member of selectedList.value) {
    list.push(member);
  }
  if (props.source === 'chatList') {
    dispatchedCreateGroup(list);
  } else if (props.source === 'existingGroup') {
    dispatchedGroupAddMember();
  } else if (props.source === 'personalFriend') {
    dispatchedCreateGroupFromContact();
  } else if (props.source === 'share') {
    dispatchedShare(list);
  } else if (props.source === 'input@mention') {
    dispatchedMention(list);
  }
}

const dispatchedCreateGroup = (list: Array<number>) => {
  createGroup(createGroupName.value, list);
  dialog.value = false;
}

const dispatchedGroupAddMember = () => {
  groupAddMember(props.baseGroup.id, selectedList.value);
  dialog.value = false;
}

const dispatchedCreateGroupFromContact = () => {
  console.log("create group from contact", createGroupName.value, selectedList.value);
  createGroup(createGroupName.value, selectedList.value);
  selectedList.value = [];
  dialog.value = false;
}

const dispatchedShare = (list) => {
  for (const receiverId of selectedList.value) {
    for (const message of props.sharedMessages) {
      sendMessage(receiverId, message.content, message.t_type);
    }
  }
  dialog.value = false;
}

const positiveButtonText = computed(() => {
  if (props.source === 'personalFriend') {
    return 'Create';
  } else if (props.source === 'existingGroup') {
    return 'Add';
  } else if (props.source === 'chatList') {
    return 'Create';
  } else {
    return 'Confirm';
  }
});

const negativeButtonText = computed(() => {
  return 'Cancel';
})

</script>

<template>
  <v-dialog v-model="dialog" max-width="30vw" max-height="80vh">
    <v-card class="fill-height overflow-y-auto">
      <v-card-title class="text-center">
        {{ title }}
      </v-card-title>
      <v-card-text class="overflow-y-auto d-flex flex-column">
        <v-text-field
            density="compact"
            label="group name"
            v-model="createGroupName"
            variant="outlined"
        />
        <v-text-field
            density="compact"
            label="Search"
        />
        <div class="d-flex overflow-x-auto flex-shrink-0">
          <div
              v-for="member in pinedInfo"
              :key="users[member].id"
              class="d-flex flex-column align-center bg-indigo rounded-lg pa-1 ma-1"
              v-ripple
              style="max-width: 40px"
          >
            <Avatar :contact-id="users[member].id"/>
            <p>{{ users[member].name }}</p>
          </div>
          <div
              v-for="member in selectedInfo"
              :key="users[member].id"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              @click="actUnselect(users[member].id)"
              v-ripple
              style="max-width: 40px"
          >
            <Avatar :contact-id="users[member].id"/>
            <p>{{ users[member].name }}</p>
          </div>
        </div>
        <v-list class="overflow-y-auto flex-1-1">
          <v-list-item v-for="member in possibleMembers">
            <template #prepend>
              <Avatar :contact-id="users[member].id"/>
            </template>
            <v-list-item-title>
              {{ users[member].name }}
            </v-list-item-title>
            <template #append>
              <v-btn
                  v-if="!selectedList.includes(users[member].id) && !pinedList.includes(users[member].id)"
                  @click="actSelect(users[member].id)"
                  color="blue"
              >
                APPEND
              </v-btn>
              <v-btn
                  v-else
                  @click="actUnselect(users[member].id)"
                  color="red"
                  :disabled="pinedList.includes(users[member].id)"
              >REMOVE
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer/>
        <v-btn @click="dialog=false">
          {{ negativeButtonText }}
        </v-btn>
        <v-btn @click="dispatchFunction">{{ positiveButtonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
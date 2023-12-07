<script setup lang="ts">

import {computed, ref, watch} from "vue";
import {activeChatId, contacts, user, userId} from "../globals.ts";
import {createGroup, sendMessage} from "../core/users/send.ts";
import {groupAddMember} from "../core/groups/send.ts";
import Avatar from "./Avatar.vue";
import {getUser} from "../core/data.ts";
import ListItem from "./ListItem.vue";
import List from "./List.vue";

/**
 * source: chatList, personalFriend, existingGroup, share
 *
 */
const props = defineProps(['showDialog', 'title', 'contactId', 'source', 'sharedMessages', 'baseGroup', 'selected', 'pinned', 'possible']);
const emit = defineEmits(['update:showDialog', 'update:selected', 'update:pinned']);
const createGroupName = ref('');



const pinnedList = computed({
  get() {
    if (!props.pinned) {
      return [];
    }
    return props.pinned;
  },
  set(newValue) {
    emit('update:pinned', newValue);
  }
});
const selectedList = computed({
  get() {
    return props.selected;
  },
  set(newValue) {
    emit('update:selected', newValue);
  }
});

const actUnselect = (id: number) => {
  selectedList.value = selectedList.value.filter((i) => {
    return id !== i;
  });
}

const possibleMembers = computed(() => {
  return contacts.value.filter((id) => {
    return getUser(id).category === "user";
  });
});

const dialog = computed({
  get: () => props.showDialog,
  set: (value) => {
    emit('update:showDialog', value)
  }
});

watch(dialog, (newValue) => {

});

const dispatchedMention = (names: Array<number>) => {
  emit('membersSelected', names);
  dialog.value = false;
}

const dispatchFunction = () => {
  console.log('source', props.source);
  const list = [];
  for (const member of pinnedList.value) {
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

const dispatchedShare = (list: Array<number>) => {
  for (const member of list) {
    for (const message of props.sharedMessages) {
      sendMessage(member, message.content, message.t_type);
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
  <v-dialog v-model="dialog" max-width="40vw" max-height="90vh">
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
              :key="member"
              class="d-flex flex-column align-center bg-indigo rounded-lg pa-1 ma-1"
              v-ripple
              style="max-width: 40px"
          >
            <Avatar :contact-id="member"/>
            <p>{{ getUser(member).name }}</p>
          </div>
          <div
              v-for="member in selectedInfo"
              :key="member"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              @click="actUnselect(member)"
              v-ripple
              style="max-width: 40px"
          >
            <Avatar :contact-id="member"/>
            <p>{{ getUser(member).name }}</p>
          </div>
        </div>
        <List class="overflow-y-auto flex-1-1" mode="multi" v-model="selectedList">
          <ListItem
              v-for="member in possibleMembers"
              :title="getUser(member).name"
              :k="member"
              :pin="pinnedList.includes(member)"
          >
            <template #prepend>
              <Avatar :contact-id="member"/>
            </template>
          </ListItem>
        </List>
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
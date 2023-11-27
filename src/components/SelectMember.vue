<script setup>

import {computed, onMounted, ref} from "vue";
import {createGroup, groupAddMember, sendMessage} from "../core/chat.ts";
import {activeChatId, messages, rawChatList, user, userId, users} from "../globals.ts";
import {getAvatarOrDefault} from "../core/data.ts";
/**
 * source: chatList, personalFriend, existingGroup, share
 *
 */
const props = defineProps(['showDialog', 'title', 'contactId', 'source', 'sharedMessages']);
const emit = defineEmits(['update:showDialog']);
const createGroupName = ref('');

const pinedList = ref([]);
const selectedList = ref([]);

const pinedInfo = computed(() => {
  const list = [];
  if (props.source === 'chatList') {
    list.push(user.value);
  }
  return list;
});

const selectedInfo = computed(() => {
  const list = [];
  for (const entry of rawChatList.value) {
    if (selectedList.value.includes(entry.id)) {
      list.push(entry);
    }
  }
  return list;
})

onMounted(() => {
  if (props.source === 'personalFriend') {
    pinedList.value.push(activeChatId.value);
    pinedList.value.push(userId.value);
  } else if (props.source === 'existingGroup') {

  } else if (props.source === 'chatList') {
    if (!pinedList.value.includes(userId.value)) {
      pinedList.value.push(userId.value);
    }
  }
});

const actSelect = (id) => {
  if (!selectedList.value.includes(id)) {
    selectedList.value.push(id);
  }

}
const actUnselect = (id) => {
  selectedList.value = selectedList.value.filter((i) => {
    return id !== i;
  })
}

const possibleMembers = computed(() => {
  const list = [];
  for (const entry of rawChatList.value) {
    if (entry.category === 'user') {
      list.push(entry);
    }
  }
  return list;
});

const dialog = computed({
  get: () => props.showDialog,
  set: (value) => emit('update:showDialog', value)
});

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
  }
}

const dispatchedCreateGroup = (list) => {
  console.log("create group", createGroupName.value, list);
  createGroup(createGroupName.value, list);
  dialog.value = false;
}

const dispatchedGroupAddMember = () => {
  console.log(
      "log",
      selected.value + "",
      "disContId",
      props.contactId
  );
  for (const id of selected.value) {
    console.log("Adding group member", props.contactId, id);
    const contact = users.value[id];
    groupAddMember(props.contactId, id);
    const memberInfo = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
    };
    users.value[props.contactId].id2member[contact.id] = memberInfo;
    users.value[props.contactId].members.push(memberInfo);
  }
  selected.value = [];
  dialog.value = false;
}

const dispatchedCreateGroupFromContact = () => {
  console.log("create group from contact", createGroupName.value, selected.value);
  createGroup(createGroupName.value, selected.value);
  selected.value = [];
  dialog.value = false;
}

const dispatchedShare = () => {
  for (const receiverId of selectedList.value) {
    for (const message of props.sharedMessages) {
      sendMessage(receiverId, message.content, message.t_type);
    }
  }
  dialog.value = false;
}
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
              :key="member.id"
              class="d-flex flex-column align-center bg-indigo rounded-lg pa-1 ma-1"
              v-ripple
          >
            <v-avatar>
              <v-img :src="getAvatarOrDefault(member.avatar)" cover></v-img>
            </v-avatar>
            <p>{{ member.name }}</p>
          </div>
        </div>
        <div class="d-flex overflow-x-auto flex-shrink-0">
          <div
              v-for="member in selectedInfo"
              :key="member.id"
              class="d-flex flex-column align-center bg-blue rounded-lg pa-1 ma-1"
              @click="actUnselect(member.id)"
              v-ripple
          >
            <v-avatar>
              <v-img :src="getAvatarOrDefault(member.avatar)" cover></v-img>
            </v-avatar>
            <p>{{ member.name }}</p>
          </div>
        </div>
        <v-list class="overflow-y-auto flex-1-1">
          <v-list-item v-for="member in possibleMembers">
            <template #prepend>
              <v-avatar>
                <v-img :src="getAvatarOrDefault(member.avatar)" cover></v-img>
              </v-avatar>
            </template>
            <v-list-item-title>
              {{ member.name }}
            </v-list-item-title>
            <template #append>
              <v-btn
                  v-if="!selectedList.includes(member.id)"
                  @click="actSelect(member.id)"
                  color="blue"
              >
                APPEND
              </v-btn>
              <v-btn
                  v-else
                  @click="actUnselect(member.id)"
                  color="red"
              >REMOVE
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer/>
        <v-btn @click="() => {dialog = false; selected = type === 'create_group_from_contact' ? [contactId] : []}">
          Cancel
        </v-btn>
        <v-btn @click="dispatchFunction">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
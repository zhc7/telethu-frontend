<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef} from "../globals.js";
import {contacts} from "../chat.js";
import List from "./List.vue";
import ListItem from "./ListItem.vue";
import {DEBUG} from "../constants.js";

const props = defineProps(['modelValue'])
const emit = defineEmits(["update:modelValue"])
const selected = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    console.log("list", value);
  }
});

const createGroup = ref(false);


// values of contacts.value
const chatList = ref();

const UpdateChatList = () => {
  chatList.value = Object.values(contacts.value).sort((a, b) => (a.time - b.time));
  if (DEBUG) {
    console.log("updating chat list", chatList.value);
  }
  chatList.value.map((chat) => {
    if (chat.messages === undefined) chat.messages = [];
    if (chat.messages.length === 0) {
      chat.hotMessage = undefined;
    } else {
      chat.hotMessage = chat.messages[chat.messages.length - 1];
    }
    return chat;
  });
}

const handlePlus = () => {
  createGroup.value = true;
}

watch(contacts, UpdateChatList);

onMounted(() => {
  console.log("chat list mounted");
  UpdateChatList();
})
</script>

<template>
  <v-dialog v-model="createGroup">
    <v-row mt="4">
      <v-col cols="4" offset="4">
        <v-card>
          <v-card-title class="text-center">
            Create Group
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field density="compact"
                                label="Search"></v-text-field>
                </v-col>
              </v-row>
              <v-list>
                <v-list-item v-for="contact in {
                  1: {
                    'id': 1,
                    'username': 'Alice',
                    'avatar': '/public/Shenium.png',
                  },
                  2: {
                    'id': 2,
                    'username': 'Bob',
                    'avatar': '/public/Shenium.png',
                  },
                  3: {
                    'id': 3,
                    'username': 'Alice',
                    'avatar': '/public/Shenium.png',
                  }
                }"
                >
                  <template #prepend>
                    <v-avatar>
                      <v-img :src="contact.avatar" cover></v-img>
                    </v-avatar>
                  </template>
                  <v-list-item-title>
                    {{ contact.username }}
                  </v-list-item-title>
                  <template #append>
                    Append
<!--                    <v-avatar>-->
<!--                      <v-img :src="contact.avatar" cover></v-img>-->
<!--                    </v-avatar>-->
                  </template>
                </v-list-item>

              </v-list>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn>Done</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-dialog>
  <List class="fill-height" v-model="selected">
    <v-list-item
        append-icon="mdi-plus"
    >
      <template #prepend>
        <v-icon>mdi-magnify</v-icon>
      </template>
      <a href="https://ys.mihoyo.com/?utm_source=adbdpz&from_channel=adbdpz#/">TeleTHU</a>
      <template #append>
        <v-icon
            @click="handlePlus">mdi-plus
        </v-icon>
      </template>
    </v-list-item>
    <ListItem
        :key="chat.id"
        :k="chat.id"
        class="pa-3 pl-6 chat-list-item text-left"
        rounded="lg"
        v-for="chat in chatList"
        :title="chat.type !== 'grp' ? chat.username : chat.name"
        :subtitle="chat.hotMessage ? chat.hotMessage.content : ''"
    >
      <template #prepend>
        <v-avatar>
          <v-img :src="chat.type !== 'grp' ? chat.avatar : '/public/baidu.webp'" cover/>
        </v-avatar>
      </template>
      <div class="chat-time fill-height">{{
          chat.hotMessage ? FormatChatMessageTime(nowRef, chat.hotMessage.time) : ''
        }}
      </div>
      <template #append>
        <v-badge color="red" content="1" inline></v-badge>
      </template>
    </ListItem>
  </List>
</template>

<style scoped>
.chat-list-item {
  position: relative;
}

.chat-time {
  font-size: 0.75em;
  position: absolute;
  right: 4em;
  top: 2em;
  color: #888
}
</style>
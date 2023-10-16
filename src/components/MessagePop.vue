<script setup>
import {onMounted, ref} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef, userRef} from "../globals.js";

const props = defineProps(['message', 'final', 'avatar']);
const emits = defineEmits((['finished']));

const messagePop = ref(1);
const contentHeight = ref('40px');
const user = 'Shenium';

onMounted(() => {
  const height = messagePop.value.offsetHeight;
  contentHeight.value = Math.max(height, 40) + 'px';
  if (props.final) {
    emits('finished');
  }
});
</script>

<template>
  <v-row no-gutters justify="center" class="ma-3s">{{ FormatChatMessageTime(nowRef, message.time) }}
  </v-row>
  <v-row no-gutters>
    <v-col cols="8" :offset="message.sender === user ? 4 : 0">
      <v-list>
        <div>
          <v-list-item>
            <template v-if="user === message.receiver" #prepend class="mb-auto">
              <v-avatar :style="{ height: contentHeight }" class="align-start pt-1">
                <v-avatar>
                  <v-img
                      :src="avatar"
                      alt="John"
                  ></v-img>
                </v-avatar>
              </v-avatar>
            </template>
            <v-row class="pa-2" :justify="user === message.sender ? 'end' : 'start'">
              <v-col cols="auto">
                <div ref="messagePop">
                  <v-card
                      class="pa-3 text-left"
                      :color="user === message.sender ? 'success': 'info'"
                      rounded="lg"
                      outlined
                  >
                    <span v-if="message.type === 'text'">{{ message.content }}</span>
                    <v-img
                        v-if="message.type === 'image'"
                        class="align-end text-white"
                        height="200"
                        width="200"
                        :src="message.content"
                        cover
                    />
                  </v-card>
                </div>
              </v-col>
            </v-row>
            <template v-if="user === message.sender" #append class="align-start pa-1">
              <v-avatar :style="{ height: contentHeight }">
                <v-avatar>
                  <v-img
                      :src="userRef.avatar"
                      :alt="userRef.title"
                  ></v-img>
                </v-avatar>
              </v-avatar>
            </template>
          </v-list-item>
        </div>
      </v-list>
    </v-col>
  </v-row>

</template>

<style scoped>
</style>
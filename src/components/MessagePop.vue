<script setup>
import {onMounted, ref} from "vue";
import {FormatChatMessageTime} from "../utils/datetime.js";
import {nowRef} from "../globals.js";

defineProps(['message']);

const messagePop = ref(1);
const contentHeight = ref('40px');
const user = 'Shenium';

onMounted(() => {
  const height = messagePop.value.offsetHeight;
  contentHeight.value = Math.max(height, 40) + 'px';
  console.log(contentHeight.value)
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
              <v-avatar :style="{ height: contentHeight }">
                <v-avatar>
                  <v-img
                      :src="'https://cdn.vuetifyjs.com/images/lists/' + (user === message.sender ? 1 : 3) + '.jpg'"
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
             <span>
               {{ message.content }}
             </span>
                  </v-card>
                </div>

              </v-col>
            </v-row>
            <template v-if="user === message.sender" #append class="mb-auto">
              <v-list-item-avatar :style="{ height: contentHeight }">
                <v-avatar>
                  <v-img
                      src="https://cdn.vuetifyjs.com/images/lists/2.jpg"
                      alt="John"
                  ></v-img>
                </v-avatar>
              </v-list-item-avatar>
            </template>
          </v-list-item>
        </div>
      </v-list>
    </v-col>
  </v-row>

</template>

<style scoped>

</style>
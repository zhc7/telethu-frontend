<script setup lang="ts">

import {ref} from "vue";

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🤲', '👐',]

const emit = defineEmits(['emoji-click'])
const dialog = ref(false)
const emitEmojiClick = (emoji: string) => {
  emit('emoji-click', emoji)
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="20vw" max-height="40vh">
    <v-card>
      <v-card-title class="text-h5 text-center">Emojis</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
              v-for="n in emojis.length"
              :key="n"
              cols="2"
              style="padding: 3px;"
          >
            <div class="image-container ma-auto">
              <p @click="emitEmojiClick(emojis[n - 1])" class="emoji-image">{{ emojis[n - 1] }}</p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style>

.image-container {
  width: 30px;
  height: 30px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.emoji-image {
  transition: transform 0.3s;
  transform-origin: center;
  font-size: 25px;
}

.emoji-image:hover {
  transform: scale(1.1);
}

</style>
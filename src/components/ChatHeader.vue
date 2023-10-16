<script setup>
defineProps(['title', 'mute'])
</script>

<template>
  <v-card class="chat-title">
    <v-card-item>
      <template #prepend>
        <v-avatar size="30">
          <v-img src="/public/download.jpeg" contain/>
        </v-avatar>
      </template>
      <v-list-item-title>
        {{ title }}
      </v-list-item-title>
    </v-card-item>
  </v-card>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.chat-title {
  background-color: #eee;
  color: #000 !important;
}

.chat-title > div {
  margin-left: 1em;
  text-align: left;
}

</style>
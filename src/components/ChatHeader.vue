<script setup>
defineProps(['title', 'mute'])
</script>

<template>
  <v-card class="chat-title">
    <v-card-item align="left">
      <template #prepend>
        <v-avatar size="30">
          <img src="../assets/download.jpeg"/>
        </v-avatar>
      </template>
      {{ title }}
    </v-card-item>
  </v-card>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.chat-title {
  background-color: #eee;
  color: #000!important;
}

.chat-title > div {
  margin-left: 1em;
  text-align: left;
}

</style>
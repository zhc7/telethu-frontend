<script setup>
defineProps(['title', 'mute'])
</script>

<template>
  <v-row align="center" class="chat-title">
    <v-col cols="6">
      <div>
        <span> {{ title }} </span>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
.chat-title {
  width: 100%;
  height: 8vh;
  background-color: #000;
  font-weight: 700;
  font-size: 1.2em;
  border-bottom: 1px solid;
}

.chat-title > div {
  margin-left: 1em;
  text-align: left;
}

</style>
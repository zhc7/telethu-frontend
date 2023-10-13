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
* {
  box-sizing: border-box;
}

.chat-title {
  width: 100%;
  height: 8vh;
  min-height: 60px;
  background-color: #000;
  font-weight: 700;
  font-size: 1.2em;
  border: 1px solid;
}

.chat-title > div {
  margin-left: 1em;
  text-align: left;
}

</style>
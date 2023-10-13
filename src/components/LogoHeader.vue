<script setup>

</script>

<template>
  <v-row align="center" justify="center" class="chat-header">
    <v-card-item class="pt-3 pb-2">
      <template #subtitle>
        <span class="title-tele">Tele</span>
        <span class="title-THU">THU</span>
      </template>
    </v-card-item>
  </v-row>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.chat-header {
  height: 8vh;
}

.title-tele {
  background-color: black;
  color: orange;
  padding: 3px;
  font-weight: 1000;
  border-radius: 0 2px;
}

.title-THU {
  font-size: 0.9em;
  background-color: orange;
  color: black;
  padding: 3px;
  font-weight: 1000;
}
</style>
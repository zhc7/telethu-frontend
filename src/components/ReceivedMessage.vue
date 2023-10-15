<script setup>
defineProps([])
</script>

<template>
  <v-list-item class="align-self-begin">
    <v-list-item-content>
      <v-row class="pa-2 justify-end">
        <v-col cols="auto">
          <v-card
              class="pa-2 text-left"
              color="success"
              rounded="lg"
              outlined
          >
            <span>
                              message text
                              message text
                              message text
                              message text
                              message text
                              message text
                              message text
                              message text
                              message text
                              message text
                              message text
                              message text
                            </span>
          </v-card>
        </v-col>
      </v-row>
    </v-list-item-content>
    <template #prepend class="mb-auto">
      <v-list-item-avatar>
        <v-avatar>
          <v-img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              alt="John"
          ></v-img>
        </v-avatar>
      </v-list-item-avatar>
    </template>
  </v-list-item>
</template>

<style scoped>

</style>


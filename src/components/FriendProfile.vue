<script setup>

const props = defineProps(['displayContact', 'display'])

</script>

<template>
  <v-card class="mb-auto mt-6" v-show="display">
    <v-avatar size="80">
      <v-img :src="displayContact.avatar" cover/>
    </v-avatar>
    <v-card-item>
      <v-list>
        <v-list-item-title>
          {{ displayContact.name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          @{{ displayContact.id }}
        </v-list-item-subtitle>
        <v-divider class="ma-4"/>
        <v-list-item class="text-grey-darken-3">
          <div>
            <v-row>
              <v-col cols="4" offset="" class="text-right">
                Location:
              </v-col>
              <v-col cols="8" class="text-left">
                Beijing, China Mainland
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="text-right">
                Phone:
              </v-col>
              <v-col cols="8" class="text-left">
                1145141919810
              </v-col>
            </v-row>
            <v-row v-if="displayContact.email">
              <v-col cols="4" class="text-right">
                Email:
              </v-col>
              <v-col cols="8" class="text-left">
                <a href="#">{{ displayContact.email }}</a>
              </v-col>
            </v-row>
          </div>
        </v-list-item>
      </v-list>
      <v-divider class="ma-4"/>
      <v-card-actions class="justify-center">
        <v-btn-group color="info" variant="outlined" divided>
          <v-btn>RECOMMEND</v-btn>
          <v-btn>DELETE</v-btn>
          <v-btn @click="">BLOCK</v-btn>
        </v-btn-group>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.v-card-actions .v-btn ~ .v-btn:not(.v-btn-toggle .v-btn) {
  margin-inline-start: 0;
}
</style>
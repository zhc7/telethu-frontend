<script setup>

const props = defineProps(['displayContact', 'display'])

</script>

<template>
  <v-card class="mb-auto mt-6 overflow-y-auto" v-show="display">
    <v-avatar size="80" class="mt-5">
      <v-img :src="displayContact.avatar" cover/>
    </v-avatar>
    <v-card-item class="overflow-y-auto">
      <v-list class="overflow-y-auto">
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
        <div v-if="displayContact.category === 'group'" class="overflow-y-auto fill-height">
          <v-divider class="ma-4"/>
          <v-card-title class="ma-3">
            Members
          </v-card-title>
          <div class="overflow-y-auto fill-height d-flex flex-wrap">
            <div
                v-for="member in displayContact.members"
                :key="member"
                class="d-flex flex-column align-center ma-3"
            >
              <v-avatar size="60">
                <v-img :src="member.avatar" id="member-avatar" cover/>
              </v-avatar>
              <p>{{ member.name }}</p>
            </div>
          </div>
        </div>
      </v-list>
      <v-divider class="ma-4"/>
      <v-card-actions class="justify-center">
        <v-btn-group color="info" variant="outlined" divided>
          <slot name="btn"/>
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
<script setup>
import {inject, onMounted} from 'vue'

const props = defineProps(['k', 'prepend-icon', 'prepend-avatar', 'title', 'subtitle'])
const {selected} = inject("selected")
const activated = inject("activated")

</script>

<template>
  <div
      v-ripple
      v-bind="$attrs"
      @click="selected = props.k"
      class="pa-3 d-flex flex-row justify-start align-center rounded-lg"
      :class="{'v-list-item--active': selected === props.k}"
  >
    <v-avatar v-if="props.prependAvatar" class="mr-1" size="small">
      <v-img :src="props.prependAvatar" contain/>
    </v-avatar>
    <v-icon class="mr-1" v-if="props.prependIcon">{{ props.prependIcon }}</v-icon>
    <div class="mr-2">
      <slot name="prepend"/>
    </div>
    <div :class="{'d-none': activated===false, 'd-flex': activated!==false}" class="flex-column">
      <p class="text-left" v-text="props.title"/>
      <p class="text-left text-grey" v-text="props.subtitle" style="font-size: small"/>
    </div>
    <slot/>
    <slot name="append"/>
  </div>
</template>

<style scoped>
.v-list-item--active {
  background-color: #248aff !important;
  color: white !important;
}
</style>
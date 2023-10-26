<script setup>
import {inject} from 'vue'

const props = defineProps(['k', 'prepend-icon', 'prepend-avatar', 'title', 'subtitle'])
const {selected} = inject("selected")
const activated = inject("activated", undefined)

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
      <v-img :src="props.prependAvatar" cover/>
    </v-avatar>
    <v-icon class="mr-1" v-if="props.prependIcon">{{ props.prependIcon }}</v-icon>
    <div class="mr-2">
      <slot name="prepend"/>
    </div>
    <div :class="{'d-none': activated===false, 'd-flex': activated!==false}" class="flex-column title-area">
      <p class="text-left" v-text="props.title"/>
      <span class="subtitle-wrap mr-2">
        <p class="text-left text-grey" v-text="props.subtitle" style="font-size: small"/>
      </span>
    </div>
    <slot/>
    <div class="ml-auto">
      <slot name="append"/>
    </div>
  </div>
</template>

<style scoped>
.v-list-item--active {
  background-color: #248aff !important;
  color: white !important;
}

.title-area {
  max-width: 40%;
}

.subtitle-wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
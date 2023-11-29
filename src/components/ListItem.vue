<script setup lang="ts">
import {computed, inject} from 'vue'
import {cache} from "../globals.ts";
import {getAvatar} from "../core/data.ts";

const props = defineProps(['k', 'prepend-icon', 'prepend-avatar', 'title', 'subtitle', 'badgeValue', 'avatarHash']);
const {selected} = inject<any>("selected");
const activated = inject("activated", undefined);

const computedAvatar = computed(() => {
  const avatar = props.avatarHash;
  const ret = cache.value[avatar];
  if (ret) {
    return ret;
  }
  getAvatar(props.avatarHash);
  return '/Logo.png';
});

</script>

<template>
  <div
      v-ripple
      v-bind="$attrs"
      @click="selected = props.k"
      class="pa-3 d-flex flex-row justify-start align-center rounded-lg"
      :class="{'v-list-item--active': selected === props.k, 'dark-ocean': selected === props.k}"
  >
    <v-avatar v-if="props.avatarHash" class="mr-1" size="small">
      <v-img :src="computedAvatar" cover/>
    </v-avatar>
    <div v-if="prependIcon" style="position: relative">
      <div class="badge" v-if="badgeValue">
        {{ badgeValue }}
      </div>
      <v-icon class="mr-1">
        {{ prependIcon }}
      </v-icon>
    </div>
    <div class="mr-2">
      <v-avatar v-if="avatar">
        <v-img :src="computedAvatar(chat.avatar)" cover/>
      </v-avatar>
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

.badge {
  position: absolute;
  height: 14px;
  width: 14px;
  line-height: 14px;
  right: -0.36em;
  top: -0.4em;
  font-size: 0.6em;
  z-index: 10000;
  background-color: red;
  border-radius: 7px;
  color: white;
}

</style>
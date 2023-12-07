<script setup lang="ts">
import {computed, inject} from 'vue'

const props = defineProps(['k', 'prependIcon', 'prependAvatar', 'title', 'subtitle', 'badgeValue', 'pin']);
const {selected} = inject<any>("selected");
const {mode} = inject<{mode: string | undefined}>("mode", {mode: "single"});
const activated = inject("activated", undefined);

const handleClick = () => {
  if (props.pin) return;
  if (mode === "multi") {
    if (selected.value.includes(props.k)) {
      selected.value = selected.value.filter((i: number) => {
        return i !== props.k;
      })
    } else {
      selected.value.push(props.k);
    }
  } else {
    selected.value = props.k;
  }
}

const active = computed(() => {
  if (props.pin) return true;
  if (mode === "multi") {
    return selected.value.includes(props.k);
  } else {
    return selected.value === props.k;
  }
})

</script>

<template>
  <div
      v-ripple
      v-bind="$attrs"
      @click="handleClick"
      class="pa-3 d-flex flex-row justify-start align-center rounded-lg"
      :class="{'v-list-item--active': active, 'dark-ocean': active}"
  >
    <v-avatar v-if="props.prependAvatar" class="mr-1" size="small">
      <v-img :src="props.prependAvatar" cover/>
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
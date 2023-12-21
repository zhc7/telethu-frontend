<script setup lang="ts">
import {computed, inject} from 'vue'

const props = defineProps<{
  k?: any,
  prependIcon?: string,
  prependAvatar?: string,
  title?: string,
  subtitle?: string,
  badgeValue?: number,
  pin?: boolean,
  tight?: boolean,
  unread?: boolean,
}>();
const {selected} = inject<any>("selected");
const {mode} = inject<{ mode: string | undefined }>("mode", {mode: "single"});
const activated = inject("activated", undefined);

const handleClick = () => {
  if (props.pin) return;
  if (mode === "multi") {
    if (selected.value.includes(props.k)) {
      selected.value = selected.value.filter((i: number) => {
        return i !== props.k;
      });
    } else {
      if (!selected.value.includes(props.k)) {
        selected.value.push(props.k);
      }
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
});

// if subtitle starts with [@] and the message is not read, then make it bold and red
const subtitle1 = computed(() => {
  if (props.subtitle && props.subtitle.length > 0) {
    if (props.subtitle.startsWith("[@]")) {
      if (!props.unread) {
        return props.subtitle.slice(3);
      }
      return `<span style="font-weight: bold; color: red">[@] </span>${props.subtitle.slice(3)}`;
    } else {
      return props.subtitle;
    }
  } else {
    return "";
  }
});

</script>

<template>
  <div
      :v-ripple="true"
      v-bind="$attrs"
      @click="handleClick"
      class="d-flex flex-row justify-start align-center rounded-lg list-item"
      :class="{'v-list-item--active': active, 'picked-color-list-item': active, 'pa-3': !tight}"
  >
    <v-avatar v-if="props.prependAvatar" class="mr-1" size="small">
      <v-img :src="props.prependAvatar" :cover="true"/>
    </v-avatar>
    <div v-if="prependIcon" style="position: relative;">
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
        <span v-html="subtitle1" class="text-left text-grey" style="font-size: small"/>
      </span>
    </div>
    <slot/>
    <div class="ml-auto">
      <slot name="append"/>
    </div>
  </div>
</template>

<style scoped>
.list-item:hover {
  background-color: #ebebeb;
}

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
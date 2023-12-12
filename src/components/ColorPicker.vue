<script setup lang="ts">
import {ref, watch} from "vue";
import {colorPickerDialog, colors} from "../globals.ts";

const emit = defineEmits(['update:showDialog']);

const page = ref(1);

const pickingColor1 = ref('');
const pickingColor2 = ref('');
const pickingColor3 = ref('');
const pickingColor4 = ref('');
const setColor = () => {
  if (pickingColor1.value !== '' && pickingColor2.value !== '' && pickingColor3.value !== '' && pickingColor4.value !== '') {
    document.documentElement.style.setProperty('--picked-color1', pickingColor1.value);
    document.documentElement.style.setProperty('--picked-color2', pickingColor2.value);
    document.documentElement.style.setProperty('--picked-color3', pickingColor3.value);
    document.documentElement.style.setProperty('--picked-color4', pickingColor4.value);
  }
  colors.value = {
    color1: pickingColor1.value,
    color2: pickingColor2.value,
    color3: pickingColor3.value,
    color4: pickingColor4.value,
  };
  emit('update:showDialog', false);
  page.value = 1;
}
const setDefaultColor = () => {
  if (page.value === 1) {
    pickingColor1.value = '#4286f4';
    pickingColor2.value = '#373B44';
    page.value = 2;
  } else if (page.value === 2) {
    pickingColor3.value = '#f8b8b8';
    pickingColor4.value = '#b8c6ea';
    setColor();
  }
}

watch(colorPickerDialog, (newValue) => {
  if (newValue) {
    pickingColor1.value = getComputedStyle(document.documentElement).getPropertyValue('--picked-color1');
    pickingColor2.value = getComputedStyle(document.documentElement).getPropertyValue('--picked-color2');
    pickingColor3.value = getComputedStyle(document.documentElement).getPropertyValue('--picked-color3');
    pickingColor4.value = getComputedStyle(document.documentElement).getPropertyValue('--picked-color4');
  }
});

</script>

<template>
  <v-dialog max-width="45vw" max-height="70vh">
    <v-card class="fill-height">
      <v-card-title class="text-center ma-5" v-if="page === 1">
        Pick color for List Item
      </v-card-title>
      <v-card-title class="text-center ma-5" v-if="page === 2">
        Pick color for Toolbar
      </v-card-title>
      <v-row class="justify-center" v-if="page === 1">
        <v-color-picker
            show-swatches
            v-model="pickingColor1"
        ></v-color-picker>
        <span class="mx-4"></span>
        <v-color-picker
            show-swatches
            v-model="pickingColor2"
        ></v-color-picker>
      </v-row>
      <v-row class="justify-center" v-if="page === 2">
        <v-color-picker
            show-swatches
            v-model="pickingColor3"
        ></v-color-picker>
        <span class="mx-4"></span>
        <v-color-picker
            show-swatches
            v-model="pickingColor4"
        ></v-color-picker>
      </v-row>
      <span class="mt-6 text-center" style="color: #888888">Pick two color to make it linear gradient.</span>
      <v-card-actions class="mb-3 mr-4">
        <v-spacer></v-spacer>
        <v-btn color="info" @click="setDefaultColor">default</v-btn>
        <v-btn color="info" v-if="page === 1" @click="page = 2">Next</v-btn>
        <v-btn color="info" v-if="page === 2" @click="setColor">Confirm</v-btn>
        <v-btn color="error" @click="emit('update:showDialog', false); page = 1">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
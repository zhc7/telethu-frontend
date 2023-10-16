<script setup>
import {ref} from "vue";

const editingMessage = ref([])

</script>

<template>
  <v-card
      max-width="600"
      class="mx-auto"
  >
    <div class="d-flex justify-space-between pa-4 pb-0">
      <v-btn-toggle
          v-model="formatting"
          multiple
          variant="outlined"
          divided
      >
        <v-btn>
          <v-icon icon="mdi-format-italic"></v-icon>
        </v-btn>

        <v-btn>
          <v-icon icon="mdi-format-bold"></v-icon>
        </v-btn>

        <v-btn>
          <v-icon icon="mdi-format-underline"></v-icon>
        </v-btn>

        <v-btn>
          <div class="d-flex align-center flex-column justify-center">
            <v-icon icon="mdi-format-color-text"></v-icon>

            <v-sheet
                tile
                height="4"
                width="26"
                color="purple"
            ></v-sheet>
          </div>
        </v-btn>
      </v-btn-toggle>

      <v-btn-toggle
          v-model="alignment"
          variant="outlined"
          divided
      >
        <v-btn>
          <v-icon icon="mdi-format-align-center"></v-icon>
        </v-btn>

        <v-btn>
          <v-icon icon="mdi-format-align-left"></v-icon>
        </v-btn>

        <v-btn>
          <v-icon icon="mdi-format-align-right"></v-icon>
        </v-btn>
      </v-btn-toggle>
    </div>

    <v-sheet class="pa-4 text-center">
      <v-textarea
          v-model="value"
          variant="outlined"
          auto-grow
          full-width
          rows="2"
          hide-details
      ></v-textarea>
    </v-sheet>
  </v-card>
</template>
<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
</style>
<template>
    <v-dialog v-model="state.dialog" max-width="600px">
        <v-card>
            <v-card-title>Sign Up Through Email</v-card-title>
            <v-card-text>
                <v-text-field label="Email" v-model="state.email"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="goToNextPage">Next</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script setup>
import { reactive } from 'vue';
import {DEBUG} from '../const/constants.js'

const state = reactive({
    dialog: false,
    email: ''
});

const open = () => {
    state.dialog = true;
};

const goToNextPage = () => {
    // 你的下一页逻辑
    state.dialog = false; // 举例：关闭对话框
};
</script>
  
<style scoped>
/* 你的样式 */
</style>
  
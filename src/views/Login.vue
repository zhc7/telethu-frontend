<script>
import { ref } from 'vue';

export default {
  name: 'LoginComponent',
  setup() {
    const email = ref('');
    const password = ref('');

    // 可以在这里添加更多的逻辑，如登录函数等

    return {
      email,
      password
    };
  }
}
</script>

<template>
    <v-container fluid>
      <v-row class="fill-height">
  
        <!-- 左侧图标区域 -->
        <v-col cols="5" class="text-center align-self-center">
          <!-- 替换下面的路径为你的图标路径 -->
          <img src="../assets/vue.svg" alt="Logo" style="max-width: 100%;">
        </v-col>
        <v-col cols="2">
            <!-- 空内容或其他内容 -->
        </v-col>
        <!-- 右侧登录表单区域 -->
            <v-col cols="5" class="align-self-center">
                <h1 class="mb-15">Welcome to TeleTHU!</h1>
                <v-text-field
                    label="Email"
                    v-model="email"
                    prepend-icon="mdi-email"
                    type="email"
                    class="mb-3"
                ></v-text-field>
        
                <v-text-field
                    label="Password"
                    v-model="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    class="mb-5"
                ></v-text-field>

                <v-row>
                    <v-col cols="6">
                        <v-btn color="primary" class="login-btn">登录</v-btn>  <!-- 登录按钮 -->
                    </v-col>
                    <v-col cols="6">
                            <div class="flex-grow-1 text-right">
                                <p>Didn't have an account?</p>
                                <a href="/signup">Sign up right now!</a>  <!-- 注册链接 -->
                            </div>
                    </v-col>
                </v-row>
  
            </v-col>
        </v-row>
    </v-container>
</template>
  

<style>
.login-btn {
    width: 88px;
    height: 49.5px!important;
    margin-right: 40px;
    align-items: center;
}

</style>

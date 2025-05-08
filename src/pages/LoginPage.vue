<template>
  <div>
    <NavBar />
    <div class="login-container">
      <div class="login-form">
        <h2>用户登录</h2>
        <a-form
          :model="loginForm"
          :rules="rules"
          @finish="handleSubmit"
          layout="vertical"
        >
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="loginForm.username"
              placeholder="请输入用户名"
            />
          </a-form-item>

          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="loginForm.password"
              placeholder="请输入密码"
            />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading" block>
              登录
            </a-button>
          </a-form-item>

          <div class="form-footer">
            没有账号？ <router-link to="/register">立即注册</router-link>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { userService } from "@/services";
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const loading = ref(false);

const loginForm = ref({
  username: "",
  password: ""
});

const rules = {
  username: [{ required: true, message: "请输入用户名" }],
  password: [{ required: true, message: "请输入密码" }]
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    const res = await userService.loginUser({
      username: loginForm.value.username,
      password: loginForm.value.password
    });
    
    if (res.code === 200) {
      // 在token信息中添加用户名
      const tokenData = res.data;
      tokenData.username = loginForm.value.username;
      
      // 登录成功，保存token信息
      localStorage.setItem('tokenInfo', JSON.stringify(tokenData));
      message.success('登录成功');
      // 跳转到首页
      router.push('/');
    } else {
      message.error(res.message || '登录失败');
    }
  } catch (error) {
    message.error('登录失败，请稍后再试');
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  background-color: #f0f2f5;
}

.login-form {
  width: 350px;
  padding: 30px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #1890ff;
}

.form-footer {
  text-align: center;
  margin-top: 16px;
  color: #666;
}

.form-footer a {
  color: #1890ff;
  text-decoration: none;
}
</style> 
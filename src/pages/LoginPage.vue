<template>
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
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { userService } from "@/services";

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
      // 登录成功，保存token信息
      localStorage.setItem("tokenInfo", JSON.stringify(res.data));
      message.success("登录成功");
      // 跳转到首页
      router.push("/");
    } else {
      message.error(res.message || "登录失败");
    }
  } catch (error) {
    message.error("登录失败，请稍后再试");
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
  height: 100vh;
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
}
</style> 
<template>
  <div class="admin-login">
    <div class="login-form">
      <h2>管理员登录</h2>
      <a-form
        :model="formState"
        name="admin_login"
        @finish="onFinish"
        autocomplete="off"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input v-model:value="formState.username" placeholder="用户名">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formState.password" placeholder="密码">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
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
import { ref, reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { adminService } from '@/services';

const router = useRouter();
const loading = ref(false);

const formState = reactive({
  username: '',
  password: '',
});

const onFinish = async (values: any) => {
  loading.value = true;
  try {
    const res = await adminService.adminLogin(values);
    if (res.code === 200) {
      const tokenData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      tokenData.username = values.username;
      
      localStorage.setItem('tokenInfo', JSON.stringify(tokenData));
      
      message.success('登录成功');
      router.push('/admin/posts');
    } else {
      message.error(res.message || '登录失败');
    }
  } catch (error) {
    console.error('登录失败:', error);
    message.error('登录失败，请重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.admin-login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #1890ff;
}
</style> 
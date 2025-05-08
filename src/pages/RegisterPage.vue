<template>
  <div>
    <NavBar />
    <div class="register-container">
      <div class="register-form">
        <h2>用户注册</h2>
        <a-form
          :model="registerForm"
          :rules="rules"
          @finish="handleSubmit"
          layout="vertical"
        >
          <a-form-item label="用户名" name="username">
            <a-input 
              v-model:value="registerForm.username" 
              placeholder="请输入用户名" 
            />
          </a-form-item>
          
          <a-form-item label="密码" name="password">
            <a-input-password 
              v-model:value="registerForm.password" 
              placeholder="请输入密码" 
            />
          </a-form-item>
          
          <a-form-item label="确认密码" name="confirmPassword">
            <a-input-password 
              v-model:value="registerForm.confirmPassword" 
              placeholder="请再次输入密码" 
            />
          </a-form-item>
          
          <a-form-item label="昵称" name="nickname">
            <a-input 
              v-model:value="registerForm.nickname" 
              placeholder="请输入昵称" 
            />
          </a-form-item>
          
          <a-form-item label="性别" name="gender">
            <a-radio-group v-model:value="registerForm.gender">
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
              <a-radio :value="0">保密</a-radio>
            </a-radio-group>
          </a-form-item>
          
          <a-form-item>
            <a-button type="primary" html-type="submit" :loading="loading" block>
              注册
            </a-button>
          </a-form-item>
          
          <div class="form-footer">
            已有账号？ <router-link to="/login">立即登录</router-link>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { userService } from '@/services';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const loading = ref(false);

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  gender: 0,
});

const validateConfirmPassword = async (_rule: any, value: string) => {
  if (value === '') {
    return Promise.reject('请确认密码');
  } else if (value !== registerForm.value.password) {
    return Promise.reject('两次输入的密码不一致');
  }
  return Promise.resolve();
};

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '用户名长度必须在4-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须在6-20个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 20, message: '昵称长度不能超过20个字符', trigger: 'blur' }
  ]
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    // 构造注册请求参数
    const userData = {
      username: registerForm.value.username,
      password: registerForm.value.password,
      nickname: registerForm.value.nickname,
      gender: registerForm.value.gender
    };
    
    const res = await userService.registerUser(userData);
    
    if (res.code === 200) {
      message.success('注册成功');
      // 跳转到登录页面
      router.push('/login');
    } else {
      message.error(res.message || '注册失败');
    }
  } catch (error) {
    console.error('注册失败:', error);
    message.error('注册失败，请稍后再试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  background-color: #f0f2f5;
  padding: 24px 0;
}

.register-form {
  width: 400px;
  padding: 32px;
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
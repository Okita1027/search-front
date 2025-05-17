<template>
  <div class="navbar-container">
    <div class="navbar">
      <div class="logo">聚合搜索平台</div>
      <div class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/register" class="nav-link" v-if="!isLoggedIn">注册</router-link>
        <router-link to="/login" class="nav-link" v-if="!isLoggedIn">登录</router-link>
        <router-link to="/profile" class="nav-link" v-if="isLoggedIn">个人中心</router-link>
        <a @click="handleLogout" class="nav-link logout" v-if="isLoggedIn">退出登录</a>
      </div>
      <div class="user-info" v-if="isLoggedIn">
        <a-avatar v-if="userInfo?.avatarUrl" :src="userInfo.avatarUrl" />
        <a-avatar v-else>{{ userInfo?.nickname?.charAt(0) || 'U' }}</a-avatar>
        <span class="username">{{ userInfo?.nickname || '用户' }}</span>
      </div>
      <router-link to="/admin/login" class="nav-link admin-link">后台管理</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { authService, userService } from '@/services';

const router = useRouter();
const userInfo = ref<any>(null);

// 计算属性：是否已登录
const isLoggedIn = computed(() => {
  return authService.isLoggedIn();
});

// 获取用户信息
const fetchUserInfo = async () => {
  if (isLoggedIn.value) {
    const username = authService.getCurrentUsername();
    if (username) {
      try {
        const response = await userService.getUserDetail(username);
        if (response.code === 200) {
          userInfo.value = response.data;
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    }
  }
};

// 退出登录
const handleLogout = async () => {
  try {
    await userService.logoutUser();
    authService.clearLoginInfo();
    message.success('退出登录成功');
    userInfo.value = null;
    router.push('/');
    // 添加页面刷新
    window.location.reload();
  } catch (error) {
    console.error('退出登录失败:', error);
    message.error('退出登录失败');
  }
};

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.navbar-container {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  height: 64px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  font-size: 16px;
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #1890ff;
}

.router-link-active {
  color: #1890ff;
  font-weight: 500;
}

.logout {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: #333;
}

.admin-link {
  margin-left: 24px;
  color: #1890ff;
}
</style> 
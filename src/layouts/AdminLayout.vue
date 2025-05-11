<template>
  <a-layout class="admin-layout">
    <a-layout-header class="header">
      <div class="logo">后台管理系统</div>
      <div class="nav">
        <router-link to="/admin/posts" class="nav-link">文章管理</router-link>
        <router-link to="/admin/pictures" class="nav-link">图片管理</router-link>
        <router-link to="/admin/audios" class="nav-link">音频管理</router-link>
        <router-link to="/admin/videos" class="nav-link">视频管理</router-link>
        <router-link to="/admin/users" class="nav-link">用户管理</router-link>
        <a @click="handleLogout" class="nav-link">退出登录</a>
      </div>
    </a-layout-header>
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { adminService } from '@/services';

const router = useRouter();

const handleLogout = async () => {
  try {
    const res = await adminService.adminLogout();
    if (res.code === 200) {
      localStorage.removeItem('loginId');
      message.success('退出成功');
      router.push('/admin/login');
    }
  } catch (error) {
    message.error('退出失败');
  }
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.nav-link:hover {
  color: #1890ff;
}

.content {
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
}
</style> 
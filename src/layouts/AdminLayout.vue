<template>
  <a-layout class="admin-layout">
    <a-layout-header class="header">
      <div class="logo">后台管理系统</div>
      <div class="nav">
        <router-link to="/admin/posts" class="nav-link" active-class="router-link-active">文章管理</router-link>
        <router-link to="/admin/comments" class="nav-link" active-class="router-link-active">评论管理</router-link>
        <router-link to="/admin/pictures" class="nav-link" active-class="router-link-active">图片管理</router-link>
        <router-link to="/admin/audios" class="nav-link" active-class="router-link-active">音频管理</router-link>
        <router-link to="/admin/videos" class="nav-link" active-class="router-link-active">视频管理</router-link>
        <router-link to="/admin/users" class="nav-link" active-class="router-link-active">用户管理</router-link>
        <router-link to="/" class="nav-link" active-class="router-link-active">回到搜索平台</router-link>
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
      localStorage.removeItem('tokenInfo');
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
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
}

.router-link-active {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.1);
  font-weight: 500;
}

.content {
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
}
</style> 
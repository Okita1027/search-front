<template>
  <div class="user-management">
    <div class="header">
      <h2>用户管理</h2>
      <div class="search-box">
        <a-input-search
          v-model:value="searchParams.username"
          placeholder="搜索用户名"
          style="width: 200px"
          @search="handleSearch"
          allowClear
        />
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="users"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'success' : 'error'">
            {{ record.status === 1 ? '正常' : '已禁用' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-popconfirm
              :title="record.status === 1 ? '确定要禁用该用户吗？' : '确定要启用该用户吗？'"
              @confirm="handleStatusChange(record)"
            >
              <a-button type="link" :danger="record.status === 1">
                {{ record.status === 1 ? '禁用' : '启用' }}
              </a-button>
            </a-popconfirm>
            <a-popconfirm
              title="确定要踢出该用户吗？"
              @confirm="handleKickout(record)"
            >
              <a-button type="link" danger>踢出</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { userService, adminService } from '@/services';
import type { TablePaginationConfig } from 'ant-design-vue';

interface User {
  id: number;
  username: string;
  nickname: string;
  status: number;
  createTime: string;
  lastLoginTime: string;
  tokenInfo?: {
    tokenValue: string;
    loginId: string;
  };
}

interface SearchParams {
  username?: string;
  current: number;
  pageSize: number;
}

const loading = ref(false);
const users = ref<User[]>([]);
const searchParams = ref<SearchParams>({
  current: 1,
  pageSize: 10
});

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '最后登录时间',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime',
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
];

const pagination = ref<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
});

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await userService.getUserListAll();
    if (res.code === 200) {
      users.value = res.data;
      // 由于getUserListAll返回的是完整列表，我们需要手动处理分页
      const start = (searchParams.value.current - 1) * searchParams.value.pageSize;
      const end = start + searchParams.value.pageSize;
      users.value = res.data.slice(start, end);
      pagination.value.total = res.data.length;
    }
  } catch (error) {
    message.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  searchParams.value.current = 1;
  fetchUsers();
};

// 处理表格变化（分页、排序等）
const handleTableChange = (pag: TablePaginationConfig) => {
  searchParams.value.current = pag.current || 1;
  searchParams.value.pageSize = pag.pageSize || 10;
  fetchUsers();
};

// 处理状态变更
const handleStatusChange = async (record: User) => {
  try {
    const newStatus = record.status === 1 ? 0 : 1;
    const res = await adminService.changeUserStatus(record.username, newStatus);
    if (res.code === 200) {
      message.success(`${newStatus === 1 ? '启用' : '禁用'}成功`);
      fetchUsers();
    }
  } catch (error) {
    message.error('操作失败');
  }
};

// 处理踢出用户
const handleKickout = async (record: User) => {
  if (!record.tokenInfo) {
    message.error('该用户未登录');
    return;
  }
  
  try {
    const res = await adminService.kickoutUser(record.tokenInfo);
    if (res.code === 200) {
      message.success('踢出成功');
      fetchUsers();
    }
  } catch (error) {
    message.error('踢出失败');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-management {
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  gap: 16px;
}
</style> 
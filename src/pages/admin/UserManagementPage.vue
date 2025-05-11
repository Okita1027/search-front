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
            {{ record.status === 1 ? "正常" : "已禁用" }}
          </a-tag>
        </template>
        <template v-if="column.key === 'login'">
          <a-tag :color="record.login ? 'success' : 'default'">
            {{ record.login ? "在线" : "离线" }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-popconfirm
              :title="record.status === 1 ? '确定要禁用该用户吗？' : '确定要启用该用户吗？'"
              @confirm="handleStatusChange(record)"
            >
              <a-button type="link" :danger="record.status === 1">
                {{ record.status === 1 ? "禁用" : "启用" }}
              </a-button>
            </a-popconfirm>
            <a-popconfirm
              v-if="record.login"
              title="确定要踢出该用户吗？"
              @confirm="handleKickout(record)"
            >
              <a-button type="link" danger>踢出</a-button>
            </a-popconfirm>
            <a-button v-else type="link" disabled>踢出</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TablePaginationConfig } from "ant-design-vue";
import { message } from "ant-design-vue";
import { adminService, userService } from "@/services";
import { AdminUserVO } from "@/types";

interface SearchParams {
  username?: string;
  current: number;
  pageSize: number;
}

const loading = ref(false);
const users = ref<AdminUserVO[]>([]);
const searchParams = ref<SearchParams>({
  current: 1,
  pageSize: 10
});

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 50
  },
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
    width: 100
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    key: "nickname",
    width: 150
  },
  {
    title: "头像",
    dataIndex: "avatarUrl",
    key: "avatarUrl",
    width: 100,
  },
  {
    title: "简介",
    dataIndex: "profile",
    key: "profile",
    width: 200,
  },
  {
    title: "性别",
    dataIndex: "gender",
    key: "gender",
    width: 50,
    customRender: ({ text }) => {
      switch (text) {
        case 0: return "保密";
        case 1: return "男";
        case 2: return "女";
        default: return "保密";
      }
    }
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
    width: 100
  },
  {
    title: "手机号",
    dataIndex: "phone",
    key: "phone",
    width: 100
  },
  {
    title: "账户状态",
    dataIndex: "status",
    key: "status",
    width: 75
  },
  {
    title: "登录状态",
    dataIndex: "login",
    key: "login",
    width: 75
  },
  {
    title: "注册时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 125
  },
  {
    title: "操作",
    key: "action",
    width: 100
  }
];

const pagination = ref<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true
});

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await userService.getUserListAll();
    if (res.code === 200) {
      const filteredData = res.data.filter(user => {
        if (searchParams.value.username) {
          return user.username.includes(searchParams.value.username);
        }
        return true;
      });
      pagination.value.total = filteredData.length;

      const start = (searchParams.value.current - 1) * searchParams.value.pageSize;
      const end = start + searchParams.value.pageSize;
      users.value = filteredData.slice(start, end);
    }
  } catch (error) {
    message.error("获取用户列表失败");
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
const handleStatusChange = async (record: AdminUserVO) => {
  try {
    const newStatus = record.status === 1 ? 0 : 1;
    const res = await adminService.changeUserStatus(record.username, newStatus);
    if (res.code === 200) {
      message.success(`${newStatus === 1 ? "启用" : "禁用"}成功`);
      fetchUsers();
    }
  } catch (error) {
    message.error("操作失败");
  }
};

// 处理踢出用户
const handleKickout = async (record: AdminUserVO) => {
  if (!record.login) {
    message.error("该用户未登录");
    return;
  }

  try {
    const res = await adminService.kickoutUser(record.id);
    if (res.code === 200) {
      message.success("踢出成功");
      fetchUsers();
    }
  } catch (error) {
    message.error("踢出失败");
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
<template>
  <div class="user-management">
    <div class="header">
      <h2>用户管理</h2>
      <div class="search-box">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-input-search
              v-model:value="searchParams.username"
              placeholder="搜索用户名"
              style="width: 100%"
              @search="handleSearch"
              allowClear
            />
          </a-col>
          <a-col :span="6">
            <a-input-search
              v-model:value="searchParams.nickname"
              placeholder="搜索昵称"
              style="width: 100%"
              @search="handleSearch"
              allowClear
            />
          </a-col>
          <a-col :span="6">
            <a-input-search
              v-model:value="searchParams.email"
              placeholder="搜索邮箱"
              style="width: 100%"
              @search="handleSearch"
              allowClear
            />
          </a-col>
          <a-col :span="6">
            <a-input-search
              v-model:value="searchParams.phone"
              placeholder="搜索手机号"
              style="width: 100%"
              @search="handleSearch"
              allowClear
            />
          </a-col>
        </a-row>
        <a-row :gutter="16" style="margin-top: 8px">
          <a-col :span="6">
            <a-select
              v-model:value="searchParams.status"
              placeholder="账户状态"
              style="width: 100%"
              @change="handleSearch"
              allowClear
            >
              <a-select-option :value="1">正常</a-select-option>
              <a-select-option :value="0">已禁用</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-select
              v-model:value="searchParams.login"
              placeholder="登录状态"
              style="width: 100%"
              @change="handleSearch"
              allowClear
            >
              <a-select-option :value="true">在线</a-select-option>
              <a-select-option :value="false">离线</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <a-date-picker
              v-model:value="searchParams.startDate"
              placeholder="开始日期"
              style="width: 100%"
              @change="handleSearch"
            />
          </a-col>
          <a-col :span="6">
            <a-date-picker
              v-model:value="searchParams.endDate"
              placeholder="结束日期"
              style="width: 100%"
              @change="handleSearch"
            />
          </a-col>
        </a-row>
        <a-row :gutter="16" style="margin-top: 8px">
          <a-col :span="24">
            <a-space>
              <a-button type="primary" @click="handleSearch">搜索</a-button>
              <a-button @click="resetSearch">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="paginatedUsers"
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
            <a-button type="link" @click="showEditModal(record)">
              编辑
            </a-button>
            <a-popconfirm
              :title="record.status === 1 ? '确定要禁用该用户吗？' : '确定要启用该用户吗？'"
              @confirm="handleStatusChange(record)"
            >
              <a-button type="link" :danger="record.status === 1">
                {{ record.status === 1 ? "禁用" : "启用" }}
              </a-button>
            </a-popconfirm>
            <a-popconfirm
              title="确定要删除该用户吗？"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 编辑用户信息的弹窗 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑用户信息"
      @ok="handleEditSubmit"
      :confirmLoading="editLoading"
    >
      <a-form :model="editForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="用户名">
          <a-input v-model:value="editForm.username" disabled />
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="editForm.nickname" />
        </a-form-item>
        <a-form-item label="简介">
          <a-textarea v-model:value="editForm.profile" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select v-model:value="editForm.gender">
            <a-select-option :value="0">保密</a-select-option>
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="editForm.email" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="editForm.phone" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { TablePaginationConfig } from "ant-design-vue";
import { message } from "ant-design-vue";
import { adminService, userService } from "@/services";
import { AdminUserVO, UserDTO } from "@/types";
import dayjs from 'dayjs';

const loading = ref(false);
const allUsers = ref<AdminUserVO[]>([]);
const searchParams = ref({
  username: "",
  nickname: "",
  email: "",
  phone: "",
  status: null as number | null,
  login: null as boolean | null,
  startDate: null as dayjs.Dayjs | null,
  endDate: null as dayjs.Dayjs | null,
});

// 重置搜索条件
const resetSearch = () => {
  searchParams.value = {
    username: "",
    nickname: "",
    email: "",
    phone: "",
    status: null,
    login: null,
    startDate: null,
    endDate: null
  };
  handleSearch();
};

// 根据搜索条件过滤用户
const filteredUsers = computed(() => {
  let result = allUsers.value;
  
  // 按用户名搜索
  if (searchParams.value.username) {
    const keyword = searchParams.value.username.toLowerCase();
    result = result.filter(user => 
      user.username && user.username.toLowerCase().includes(keyword)
    );
  }
  
  // 按昵称搜索
  if (searchParams.value.nickname) {
    const keyword = searchParams.value.nickname.toLowerCase();
    result = result.filter(user => 
      user.nickname && user.nickname.toLowerCase().includes(keyword)
    );
  }
  
  // 按邮箱搜索
  if (searchParams.value.email) {
    const keyword = searchParams.value.email.toLowerCase();
    result = result.filter(user => 
      user.email && user.email.toLowerCase().includes(keyword)
    );
  }
  
  // 按手机号搜索
  if (searchParams.value.phone) {
    const keyword = searchParams.value.phone;
    result = result.filter(user => 
      user.phone && user.phone.includes(keyword)
    );
  }
  
  // 按状态搜索
  if (searchParams.value.status !== null) {
    result = result.filter(user => user.status === searchParams.value.status);
  }
  
  // 按登录状态搜索
  if (searchParams.value.login !== null) {
    result = result.filter(user => user.login === searchParams.value.login);
  }
  
  // 按注册日期搜索
  if (searchParams.value.startDate) {
    const startDate = searchParams.value.startDate.startOf('day');
    result = result.filter(user => {
      return user.createTime && dayjs(user.createTime).isAfter(startDate);
    });
  }
  
  if (searchParams.value.endDate) {
    const endDate = searchParams.value.endDate.endOf('day');
    result = result.filter(user => {
      return user.createTime && dayjs(user.createTime).isBefore(endDate);
    });
  }
  
  return result;
});

// 分页数据
const paginatedUsers = computed(() => {
  // 分页处理
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return filteredUsers.value.slice(start, end);
});

// 更新分页总数
const updatePaginationTotal = () => {
  pagination.value.total = filteredUsers.value.length;
};

const pagination = ref<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true
});

// 编辑相关
const editModalVisible = ref(false);
const editLoading = ref(false);
const editForm = ref<UserDTO>({
  username: '',
  nickname: '',
  profile: '',
  gender: 0,
  email: '',
  phone: ''
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

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await userService.getUserListAll();
    if (res.code === 200) {
      // 存储所有用户数据用于本地过滤和分页
      allUsers.value = [...res.data];
      
      // 根据搜索条件过滤
      const filteredData = allUsers.value.filter(user => {
        if (searchParams.value.username) {
          return user.username.includes(searchParams.value.username);
        }
        return true;
      });
      
      // 更新分页信息
      pagination.value.total = filteredData.length;
      
      // 本地分页处理
      const start = (pagination.value.current as number - 1) * (pagination.value.pageSize as number);
      const end = start + (pagination.value.pageSize as number);
      allUsers.value = filteredData.slice(start, end);
    }
  } catch (error) {
    message.error("获取用户列表失败");
  } finally {
    loading.value = false;
  }
};

// 处理搜索
const handleSearch = () => {
  pagination.value.current = 1;
  updatePaginationTotal();
  fetchUsers();
};

// 处理表格变化（分页、排序等）
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.value.current = pag.current || 1;
  pagination.value.pageSize = pag.pageSize || 10;
  updatePaginationTotal();
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

// 显示编辑弹窗
const showEditModal = (record: AdminUserVO) => {
  editForm.value = {
    username: record.username,
    nickname: record.nickname || '',
    profile: record.profile || '',
    gender: record.gender || 0,
    email: record.email || '',
    phone: record.phone || ''
  };
  editModalVisible.value = true;
};

// 处理编辑提交
const handleEditSubmit = async () => {
  editLoading.value = true;
  try {
    const res = await userService.updateUserInfo(editForm.value);
    if (res.code === 200) {
      message.success("更新用户信息成功");
      editModalVisible.value = false;
      fetchUsers();
    } else {
      message.error(res.msg || "更新用户信息失败");
    }
  } catch (error) {
    message.error("更新用户信息失败");
  } finally {
    editLoading.value = false;
  }
};

// 处理删除用户
const handleDelete = async (record: AdminUserVO) => {
  try {
    const res = await adminService.deleteUser(record.id);
    if (res.code === 200) {
      message.success("删除用户成功");
      fetchUsers();
    } else {
      message.error(res.msg || "删除用户失败");
    }
  } catch (error) {
    message.error("删除用户失败");
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
  fetchUsers().then(() => {
    updatePaginationTotal();
  });
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
  flex-direction: column;
  gap: 8px;
}
</style> 
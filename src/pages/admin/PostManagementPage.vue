<template>
  <div class="post-management">
    <div class="header">
      <h2>文章管理</h2>
      <div class="search-box">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-input-search
              v-model:value="searchParams.title"
              placeholder="搜索文章标题"
              style="width: 100%"
              @search="handleSearch"
              allowClear
            />
          </a-col>
          <a-col :span="6">
            <a-input-search
              v-model:value="searchParams.content"
              placeholder="搜索文章内容"
              style="width: 100%"
              @search="handleSearch"
              allowClear
            />
          </a-col>
          <a-col :span="6">
            <a-input-search
              v-model:value="searchParams.createBy"
              placeholder="搜索创建人"
              style="width: 100%"
              @search="handleSearch"
              allowClear
            />
          </a-col>
          <a-col :span="6">
            <a-date-picker
              v-model:value="searchParams.startDate"
              placeholder="开始日期"
              style="width: 100%"
              @change="handleSearch"
            />
          </a-col>
        </a-row>
        <a-row :gutter="16" style="margin-top: 8px">
          <a-col :span="6">
            <a-date-picker
              v-model:value="searchParams.endDate"
              placeholder="结束日期"
              style="width: 100%"
              @change="handleSearch"
            />
          </a-col>
          <a-col :span="18">
            <a-space>
              <a-button type="primary" @click="handleSearch">搜索</a-button>
              <a-button @click="resetSearch">重置</a-button>
              <a-button type="primary" @click="showAddModal">新增文章</a-button>
            </a-space>
          </a-col>
        </a-row>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="paginatedPosts"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'content'">
          <a-tooltip :title="record.content">
            <span>{{ truncateText(record.content, 50) }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="showEditModal(record)">编辑</a>
            <a-popconfirm
              title="确定要删除这篇文章吗？"
              @confirm="handleDelete(record.id)"
            >
              <a class="danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新增/编辑文章弹窗 -->
    <a-modal
      v-model:visible="modalVisible"
      :title="modalTitle"
      @ok="handleModalOk"
      :confirmLoading="modalLoading"
    >
      <a-form
        :model="formState"
        :rules="rules"
        ref="formRef"
      >
        <a-form-item label="标题" name="title">
          <a-input v-model:value="formState.title" />
        </a-form-item>
        <a-form-item label="内容" name="content">
          <a-textarea
            v-model:value="formState.content"
            :rows="6"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import { postService } from "@/services";
import dayjs from 'dayjs';

const loading = ref(false);
const modalVisible = ref(false);
const modalLoading = ref(false);
const modalTitle = ref("新增文章");
const formRef = ref<FormInstance>();
const allPosts = ref<any[]>([]);
const currentId = ref<number | null>(null);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
});

// 扩展搜索参数
const searchParams = ref({
  title: "",
  content: "",
  createBy: "",
  startDate: null as dayjs.Dayjs | null,
  endDate: null as dayjs.Dayjs | null
});

// 重置搜索条件
const resetSearch = () => {
  searchParams.value = {
    title: "",
    content: "",
    createBy: "",
    startDate: null,
    endDate: null
  };
  handleSearch();
};

// 根据搜索条件过滤文章
const filteredPosts = computed(() => {
  let result = allPosts.value;
  
  // 按标题搜索
  if (searchParams.value.title) {
    const keyword = searchParams.value.title.toLowerCase();
    result = result.filter(post => 
      post.title && post.title.toLowerCase().includes(keyword)
    );
  }
  
  // 按内容搜索
  if (searchParams.value.content) {
    const keyword = searchParams.value.content.toLowerCase();
    result = result.filter(post => 
      post.content && post.content.toLowerCase().includes(keyword)
    );
  }
  
  // 按创建人搜索
  if (searchParams.value.createBy) {
    const keyword = searchParams.value.createBy.toLowerCase();
    result = result.filter(post => 
      post.createBy && post.createBy.toLowerCase().includes(keyword)
    );
  }
  
  // 按日期范围搜索
  if (searchParams.value.startDate) {
    const startDate = searchParams.value.startDate.startOf('day');
    result = result.filter(post => {
      return post.createTime && dayjs(post.createTime).isAfter(startDate);
    });
  }
  
  if (searchParams.value.endDate) {
    const endDate = searchParams.value.endDate.endOf('day');
    result = result.filter(post => {
      return post.createTime && dayjs(post.createTime).isBefore(endDate);
    });
  }
  
  return result;
});

// 分页数据
const paginatedPosts = computed(() => {
  // 分页处理
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return filteredPosts.value.slice(start, end);
});

// 更新分页总数
const updatePaginationTotal = () => {
  pagination.value.total = filteredPosts.value.length;
};

const formState = reactive({
  title: "",
  content: ""
});

const rules = {
  title: [{ required: true, message: "请输入标题" }],
  content: [{ required: true, message: "请输入内容" }]
};

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 60
  },
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
    width: 200,
    ellipsis: true
  },
  {
    title: "内容",
    dataIndex: "content",
    key: "content",
    width: 300
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 180
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime",
    width: 180
  },
  {
    title: "创建人",
    dataIndex: "createBy",
    key: "createBy",
    width: 120,
    customRender: ({ text: createBy }: { text: string }) => {
      return createBy || "管理员";
    }
  },
  {
    title: "修改人",
    dataIndex: "updateBy",
    key: "updateBy",
    width: 120,
    customRender: ({ text: updateBy }: { text: string }) => {
      return updateBy || "管理员";
    }
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    fixed: 'right'
  }
];

// 获取文章列表
const fetchPosts = async () => {
  loading.value = true;
  try {
    const res = await postService.getPostListAll();
    if (res.code === 200) {
      allPosts.value = res.data;
    }
  } catch (error) {
    message.error("获取文章列表失败");
  } finally {
    loading.value = false;
  }
};

// 显示新增弹窗
const showAddModal = () => {
  modalTitle.value = "新增文章";
  currentId.value = null;
  formState.title = "";
  formState.content = "";
  modalVisible.value = true;
};

// 显示编辑弹窗
const showEditModal = (record: any) => {
  modalTitle.value = "编辑文章";
  currentId.value = record.id;
  formState.title = record.title;
  formState.content = record.content;
  modalVisible.value = true;
};

// 处理弹窗确认
const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;

    if (currentId.value) {
      // 编辑文章
      const res = await postService.updatePost({
        id: currentId.value,
        ...formState
      });
      if (res.code === 200) {
        message.success("更新成功");
        modalVisible.value = false;
        fetchPosts();
      }
    } else {
      // 新增文章
      const res = await postService.addPost(formState);
      if (res.code === 200) {
        message.success("新增成功");
        modalVisible.value = false;
        fetchPosts();
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    modalLoading.value = false;
  }
};

// 处理删除
const handleDelete = async (id: number) => {
  try {
    const res = await postService.deletePost(id);
    if (res.code === 200) {
      message.success("删除成功");
      fetchPosts();
    }
  } catch (error) {
    message.error("删除失败");
  }
};

// 处理搜索
const handleSearch = () => {
  pagination.value.current = 1;
  updatePaginationTotal();
};

// 处理表格分页变化
const handleTableChange = (paginationInfo: any) => {
  pagination.value.current = paginationInfo.current;
  pagination.value.pageSize = paginationInfo.pageSize;
  updatePaginationTotal();
};

// 初始化
onMounted(() => {
  fetchPosts().then(() => {
    updatePaginationTotal();
  });
});
</script>

<style scoped>
.post-management {
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

.danger {
  color: #ff4d4f;
}

.danger:hover {
  color: #ff7875;
}
</style> 
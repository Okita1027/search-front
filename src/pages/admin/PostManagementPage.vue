<template>
  <div class="post-management">
    <div class="header">
      <h2>文章管理</h2>
      <a-button type="primary" @click="showAddModal">
        新增文章
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="posts"
      :loading="loading"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
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
import { onMounted, reactive, ref } from "vue";
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import { postService } from "@/services";

const loading = ref(false);
const modalVisible = ref(false);
const modalLoading = ref(false);
const modalTitle = ref("新增文章");
const formRef = ref<FormInstance>();
const posts = ref<any[]>([]);
const currentId = ref<number | null>(null);

const formState = reactive({
  title: "",
  content: ""
});

const rules = {
  title: [{ required: true, message: "请输入标题" }],
  content: [{ required: true, message: "请输入内容" }]
};

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "标题",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime"
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime"
  },
  {
    title: "创建人",
    dataIndex: "createBy",
    key: "createBy",
    customRender: ({ text: createBy }: { text: string }) => {
      return createBy || "管理员";
    }
  },
  {
    title: "修改人",
    dataIndex: "updateBy",
    key: "updateBy",
    customRender: ({ text: updateBy }: { text: string }) => {
      return updateBy || "管理员";
    }
  },
  {
    title: "操作",
    key: "action"
  }
];

// 获取文章列表
const fetchPosts = async () => {
  loading.value = true;
  try {
    const res = await postService.getPostListAll();
    if (res.code === 200) {
      posts.value = res.data;
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

onMounted(() => {
  fetchPosts();
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

.danger {
  color: #ff4d4f;
}

.danger:hover {
  color: #ff7875;
}
</style> 
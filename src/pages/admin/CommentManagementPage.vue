<template>
  <div class="comment-management">
    <div class="header">
      <h2>评论管理</h2>
      <div class="search-box">
        <a-input-search
          v-model:value="searchParams.content"
          placeholder="搜索评论内容"
          style="width: 200px"
          @search="handleSearch"
          allowClear
        />
        <a-input-search
          v-model:value="searchParams.articleTitle"
          placeholder="搜索文章标题"
          style="width: 200px"
          @search="handleSearch"
          allowClear
        />
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
      :data-source="paginatedComments"
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
            <a-popconfirm
              title="确定要删除这条评论吗？"
              @confirm="handleDelete(record.id)"
            >
              <a class="danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { message } from "ant-design-vue";
import { commentService } from "@/services";
import { ArticleComment, CommentSearchParams } from "@/types/comment";

const loading = ref(false);
const allComments = ref<ArticleComment[]>([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
});

const searchParams = ref<CommentSearchParams>({
  content: "",
  articleTitle: "",
  username: ""
});

// 根据搜索条件过滤评论
const filteredComments = computed(() => {
  let result = allComments.value;
  
  // 按内容搜索
  if (searchParams.value.content) {
    const keyword = searchParams.value.content.toLowerCase();
    result = result.filter(comment => 
      comment.content && comment.content.toLowerCase().includes(keyword)
    );
  }
  
  // 按文章标题搜索
  if (searchParams.value.articleTitle) {
    const keyword = searchParams.value.articleTitle.toLowerCase();
    result = result.filter(comment => 
      comment.articleTitle && comment.articleTitle.toLowerCase().includes(keyword)
    );
  }
  
  // 按用户名搜索
  if (searchParams.value.username) {
    const keyword = searchParams.value.username.toLowerCase();
    result = result.filter(comment => 
      (comment.currentUsername && comment.currentUsername.toLowerCase().includes(keyword)) ||
      (comment.currentNickname && comment.currentNickname.toLowerCase().includes(keyword))
    );
  }
  
  return result;
});

// 分页数据
const paginatedComments = computed(() => {
  // 分页处理
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return filteredComments.value.slice(start, end);
});

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80
  },
  {
    title: "文章标题",
    dataIndex: "articleTitle",
    key: "articleTitle",
    width: 200,
    ellipsis: true
  },
  {
    title: "楼层号",
    dataIndex: "serialNumber",
    key: "serialNumber",
    width: 80,
  },
  {
    title: "评论内容",
    dataIndex: "content",
    key: "content",
    width: 300
  },
  {
    title: "评论人",
    dataIndex: "currentNickname",
    key: "currentNickname",
    width: 120
  },
  {
    title: "回复给",
    dataIndex: "parentNickname",
    key: "parentNickname",
    width: 120,
    customRender: ({ text: parentNickname }: { text: string }) => {
      return parentNickname || '-';
    }
  },
  {
    title: "评论时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 180
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    fixed: 'right'
  }
];

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

// 获取评论列表
const fetchComments = async () => {
  loading.value = true;
  try {
    const res = await commentService.getAllComments();
    
    // 处理嵌套的数据结构
    if (res.code === 200) {
      if (Array.isArray(res.data)) {
        // 数据直接是数组
        allComments.value = res.data;
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        // 数据是嵌套的
        allComments.value = res.data.data;
      } else {
        // 不符合预期的结构
        console.error("响应数据结构异常:", res);
        allComments.value = [];
      }
    } else {
      message.error(res.message || "获取评论列表失败");
    }
  } catch (error) {
    message.error("获取评论列表失败");
    console.error("获取评论列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 处理删除评论
const handleDelete = async (id: number) => {
  try {
    const res = await commentService.deleteComment(id);
    if (res.code === 200) {
      message.success("删除成功");
      fetchComments();
    } else {
      message.error(res.message || "删除失败");
    }
  } catch (error) {
    message.error("删除失败");
    console.error("删除评论失败:", error);
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

// 更新分页总数
const updatePaginationTotal = () => {
  pagination.value.total = filteredComments.value.length;
};

onMounted(() => {
  fetchComments().then(() => {
    updatePaginationTotal();
  });
});
</script>

<style scoped>
.comment-management {
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
  align-items: center;
  gap: 10px;
}

.danger {
  color: #ff4d4f;
}

.danger:hover {
  color: #ff7875;
}
</style> 
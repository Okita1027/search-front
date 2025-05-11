<template>
  <div class="picture-management">
    <div class="header">
      <h2>图片管理</h2>
      <div class="search-box">
        <a-input-search
          v-model:value="searchParams.fileName"
          placeholder="搜索文件名"
          style="width: 200px"
          @search="handleSearch"
          allowClear
        />
        <a-upload
          :customRequest="handleUpload"
          :showUploadList="false"
          accept="image/*"
        >
          <a-button type="primary">
            上传图片
          </a-button>
        </a-upload>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="pictures"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      row-key="fileName"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'preview'">
          <img :src="getFileUrl(record.filePath)" class="preview-image" />
        </template>
        <template v-if="column.key === 'action'">
          <a-popconfirm
            title="确定要删除这张图片吗？"
            @confirm="handleDelete(record.fileName)"
          >
            <a class="danger">删除</a>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { pictureService, fileUploadService } from '@/services';

const loading = ref(false);
const pictures = ref<any[]>([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});
const searchParams = ref({
  fileName: '',
});

// 获取文件完整URL
const getFileUrl = (filePath: string) => {
  const baseUrl = process.env.VUE_APP_API_BASE_URL || '';
  return `${baseUrl}/${filePath}`;
};

const columns = [
  {
    title: '预览',
    key: 'preview',
    width: 100,
  },
  {
    title: '文件名',
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
  },
];

// 获取图片列表
const fetchPictures = async () => {
  loading.value = true;
  try {
    const res = await pictureService.getPictureListAll();
    if (res.code === 200) {
      // 根据搜索条件过滤数据
      const filteredData = res.data.filter((picture: any) => {
        if (searchParams.value.fileName) {
          return picture.fileName.toLowerCase().includes(searchParams.value.fileName.toLowerCase());
        }
        return true;
      });
      
      pagination.value.total = filteredData.length;
      
      // 分页处理
      const start = (pagination.value.current - 1) * pagination.value.pageSize;
      const end = start + pagination.value.pageSize;
      pictures.value = filteredData.slice(start, end);
    }
  } catch (error) {
    message.error('获取图片列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理上传
const handleUpload = async (options: any) => {
  const { file, onSuccess, onError } = options;
  try {
    const res = await fileUploadService.uploadFile({
      file,
      type: 'picture'
    });
    if (res.code === 200) {
      message.success('上传成功');
      fetchPictures();
      onSuccess();
    } else {
      message.error(res.message || '上传失败');
      onError();
    }
  } catch (error) {
    message.error('上传失败');
    onError();
  }
};

// 处理删除
const handleDelete = async (fileName: string) => {
  try {
    const res = await pictureService.deletePicture(fileName);
    if (res.code === 200) {
      message.success('删除成功');
      fetchPictures();
    }
  } catch (error) {
    message.error('删除失败');
  }
};

// 处理搜索
const handleSearch = () => {
  pagination.value.current = 1;
  fetchPictures();
};

// 处理表格分页变化
const handleTableChange = (paginationInfo: any) => {
  pagination.value.current = paginationInfo.current;
  pagination.value.pageSize = paginationInfo.pageSize;
  fetchPictures();
};

onMounted(() => {
  fetchPictures();
});
</script>

<style scoped>
.picture-management {
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

.preview-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.danger {
  color: #ff4d4f;
}

.danger:hover {
  color: #ff7875;
}
</style> 
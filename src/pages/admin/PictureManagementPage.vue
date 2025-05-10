<template>
  <div class="picture-management">
    <div class="header">
      <h2>图片管理</h2>
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

    <a-table
      :columns="columns"
      :data-source="pictures"
      :loading="loading"
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
      pictures.value = res.data;
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
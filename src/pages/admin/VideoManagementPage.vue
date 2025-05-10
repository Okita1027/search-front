<template>
  <div class="video-management">
    <div class="header">
      <h2>视频管理</h2>
      <a-upload
        :customRequest="handleUpload"
        :showUploadList="false"
        accept="video/*"
      >
        <a-button type="primary">
          上传视频
        </a-button>
      </a-upload>
    </div>

    <a-table
      :columns="columns"
      :data-source="videos"
      :loading="loading"
      row-key="fileName"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'preview'">
          <video controls :src="getFileUrl(record.filePath)" class="preview-video"></video>
        </template>
        <template v-if="column.key === 'action'">
          <a-popconfirm
            title="确定要删除这个视频吗？"
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
import { videoService, fileUploadService } from '@/services';

const loading = ref(false);
const videos = ref<any[]>([]);

// 获取文件完整URL
const getFileUrl = (filePath: string) => {
  const baseUrl = process.env.VUE_APP_API_BASE_URL || '';
  return `${baseUrl}/${filePath}`;
};

const columns = [
  {
    title: '预览',
    key: 'preview',
    width: 200,
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

// 获取视频列表
const fetchVideos = async () => {
  loading.value = true;
  try {
    const res = await videoService.getVideoListAll();
    if (res.code === 200) {
      videos.value = res.data;
    }
  } catch (error) {
    message.error('获取视频列表失败');
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
      type: 'video'
    });
    if (res.code === 200) {
      message.success('上传成功');
      fetchVideos();
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
    const res = await videoService.deleteVideo(fileName);
    if (res.code === 200) {
      message.success('删除成功');
      fetchVideos();
    }
  } catch (error) {
    message.error('删除失败');
  }
};

onMounted(() => {
  fetchVideos();
});
</script>

<style scoped>
.video-management {
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.preview-video {
  width: 200px;
  height: 112px;
  object-fit: cover;
}

.danger {
  color: #ff4d4f;
}

.danger:hover {
  color: #ff7875;
}
</style> 
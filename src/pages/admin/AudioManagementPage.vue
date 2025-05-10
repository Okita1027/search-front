<template>
  <div class="audio-management">
    <div class="header">
      <h2>音频管理</h2>
      <a-upload
        :customRequest="handleUpload"
        :showUploadList="false"
        accept="audio/*"
      >
        <a-button type="primary">
          上传音频
        </a-button>
      </a-upload>
    </div>

    <a-table
      :columns="columns"
      :data-source="audios"
      :loading="loading"
      row-key="fileName"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'preview'">
          <audio controls :src="getFileUrl(record.filePath)" class="preview-audio"></audio>
        </template>
        <template v-if="column.key === 'action'">
          <a-popconfirm
            title="确定要删除这个音频吗？"
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
import { audioService, fileUploadService } from '@/services';

const loading = ref(false);
const audios = ref<any[]>([]);

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

// 获取音频列表
const fetchAudios = async () => {
  loading.value = true;
  try {
    const res = await audioService.getAudioListAll();
    if (res.code === 200) {
      audios.value = res.data;
    }
  } catch (error) {
    message.error('获取音频列表失败');
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
      type: 'audio'
    });
    if (res.code === 200) {
      message.success('上传成功');
      fetchAudios();
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
    const res = await audioService.deleteAudio(fileName);
    if (res.code === 200) {
      message.success('删除成功');
      fetchAudios();
    }
  } catch (error) {
    message.error('删除失败');
  }
};

onMounted(() => {
  fetchAudios();
});
</script>

<style scoped>
.audio-management {
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.preview-audio {
  width: 200px;
}

.danger {
  color: #ff4d4f;
}

.danger:hover {
  color: #ff7875;
}
</style> 
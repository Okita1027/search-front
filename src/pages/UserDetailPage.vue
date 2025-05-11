<template>
  <div>
    <NavBar />
    <div class="user-detail-container">
      <a-card class="user-detail-card" title="用户详情" :loading="loading">
        <a-descriptions bordered>
          <a-descriptions-item label="用户头像" :span="3">
            <div class="avatar-container">
              <a-avatar :size="80" :src="userInfo.avatarUrl">
                {{ userInfo.nickname?.charAt(0) || '用户' }}
              </a-avatar>
            </div>
          </a-descriptions-item>
          
          <a-descriptions-item label="昵称">
            {{ userInfo.nickname }}
          </a-descriptions-item>
          
          <a-descriptions-item label="性别">
            {{ formatGender(userInfo.gender) }}
          </a-descriptions-item>
          
          <a-descriptions-item label="个人简介" :span="3">
            {{ userInfo.profile || '暂无简介' }}
          </a-descriptions-item>
          
          <a-descriptions-item label="手机号">
            {{ maskPhone(userInfo.phone) || '暂未设置' }}
          </a-descriptions-item>
          
          <a-descriptions-item label="邮箱">
            {{ maskEmail(userInfo.email) || '暂未设置' }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      
      <!-- 用户评论过的文章列表 -->
      <a-card v-if="userInfo.postTitleList && userInfo.postTitleList.length > 0" class="user-detail-card posts-card" title="评论过的文章" :loading="loading">
        <!-- 文章搜索框 -->
        <div class="file-search">
          <a-input-search
            v-model:value="postSearchText"
            placeholder="搜索文章标题"
            style="width: 300px"
            @change="handlePostSearch"
            allowClear
          />
        </div>

        <a-list
          itemLayout="horizontal"
          :dataSource="filteredPosts"
          :grid="{ gutter: 16, column: 2 }"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card hoverable class="post-card">
                <template #title>
                  <a @click="goToPostDetail(item)" class="post-title">{{ item }}</a>
                </template>
              </a-card>
            </a-list-item>
          </template>
          <template #empty>
            <a-empty description="没有找到匹配的文章" />
          </template>
        </a-list>
      </a-card>
      
      <!-- 用户上传的文件列表 -->
      <a-card v-if="hasUploadedFiles" class="user-detail-card files-card" title="上传的文件" :loading="loading">
        <!-- 文件搜索框 -->
        <div class="file-search">
          <a-input-search
            v-model:value="fileSearchText"
            placeholder="搜索文件名称"
            style="width: 300px"
            @change="handleFileSearch"
            allowClear
          />
        </div>

        <a-tabs>
          <!-- 图片文件 -->
          <a-tab-pane v-if="userInfo.fileListMap?.picture && userInfo.fileListMap.picture.length > 0" key="picture" tab="图片">
            <div class="file-grid">
              <div v-for="(file, index) in filteredFiles.picture" :key="`picture-${index}`" class="file-item picture-item">
                <img :src="getFileUrl(file.filePath)" :alt="file.fileName" class="preview-image" />
                <div class="file-name">{{ file.fileName }}</div>
              </div>
            </div>
            <a-empty v-if="filteredFiles.picture && filteredFiles.picture.length === 0" description="没有找到匹配的文件" />
          </a-tab-pane>
          
          <!-- 音频文件 -->
          <a-tab-pane v-if="userInfo.fileListMap?.audio && userInfo.fileListMap.audio.length > 0" key="audio" tab="音频">
            <div class="file-list">
              <div v-for="(file, index) in filteredFiles.audio" :key="`audio-${index}`" class="file-item audio-item">
                <sound-outlined class="file-icon" />
                <div class="file-info">
                  <div class="file-name">{{ file.fileName }}</div>
                  <audio 
                    controls 
                    :src="getFileUrl(file.filePath)"
                    @play="handleAudioPlay($event)"
                  ></audio>
                </div>
              </div>
            </div>
            <a-empty v-if="filteredFiles.audio && filteredFiles.audio.length === 0" description="没有找到匹配的文件" />
          </a-tab-pane>
          
          <!-- 视频文件 -->
          <a-tab-pane v-if="userInfo.fileListMap?.video && userInfo.fileListMap.video.length > 0" key="video" tab="视频">
            <div class="file-list">
              <div v-for="(file, index) in filteredFiles.video" :key="`video-${index}`" class="file-item video-item">
                <video-camera-outlined class="file-icon" />
                <div class="file-info">
                  <div class="file-name">{{ file.fileName }}</div>
                  <video 
                    controls 
                    width="100%" 
                    :src="getFileUrl(file.filePath)"
                    @play="handleVideoPlay($event)"
                  ></video>
                </div>
              </div>
            </div>
            <a-empty v-if="filteredFiles.video && filteredFiles.video.length === 0" description="没有找到匹配的文件" />
          </a-tab-pane>
          
          <!-- 如果没有任何类型的文件 -->
          <template v-if="!userInfo.fileListMap?.picture?.length && !userInfo.fileListMap?.audio?.length && !userInfo.fileListMap?.video?.length">
            <a-empty description="暂无上传文件" />
          </template>
        </a-tabs>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import { SoundOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';
import { userService } from '@/services';
import NavBar from '@/components/NavBar.vue';
import { UserDetailVO, FileListMap } from '@/types';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const userInfo = ref<UserDetailVO>({} as UserDetailVO);
const fileSearchText = ref('');
const postSearchText = ref('');

// 过滤后的文章列表
const filteredPosts = computed(() => {
  if (!userInfo.value.postTitleList || !postSearchText.value.trim()) {
    return userInfo.value.postTitleList || [];
  }

  const searchTerm = postSearchText.value.toLowerCase();
  return userInfo.value.postTitleList.filter(
    (title: string) => title.toLowerCase().includes(searchTerm)
  );
});

// 过滤后的文件列表
const filteredFiles = computed(() => {
  if (!userInfo.value.fileListMap || !fileSearchText.value.trim()) {
    return userInfo.value.fileListMap || {};
  }

  const searchTerm = fileSearchText.value.toLowerCase();
  const result: FileListMap = {};

  // 过滤图片
  if (userInfo.value.fileListMap.picture) {
    result.picture = userInfo.value.fileListMap.picture.filter(
      file => file.fileName.toLowerCase().includes(searchTerm)
    );
  }

  // 过滤音频
  if (userInfo.value.fileListMap.audio) {
    result.audio = userInfo.value.fileListMap.audio.filter(
      file => file.fileName.toLowerCase().includes(searchTerm)
    );
  }

  // 过滤视频
  if (userInfo.value.fileListMap.video) {
    result.video = userInfo.value.fileListMap.video.filter(
      file => file.fileName.toLowerCase().includes(searchTerm)
    );
  }

  return result;
});

// 判断用户是否有上传的文件
const hasUploadedFiles = computed(() => {
  return (
    (userInfo.value.fileListMap?.picture && userInfo.value.fileListMap.picture.length > 0) ||
    (userInfo.value.fileListMap?.audio && userInfo.value.fileListMap.audio.length > 0) ||
    (userInfo.value.fileListMap?.video && userInfo.value.fileListMap.video.length > 0)
  );
});

// 获取文件完整URL
const getFileUrl = (filePath: string) => {
  const baseUrl = process.env.VUE_APP_API_BASE_URL || '';
  return `${baseUrl}/${filePath}`;
};

// 格式化性别
const formatGender = (gender: number) => {
  const genderMap: Record<number, string> = {
    0: '保密',
    1: '男',
    2: '女'
  };
  return genderMap[gender] || '保密';
};

// 手机号打码
const maskPhone = (phone: string) => {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 邮箱打码
const maskEmail = (email: string) => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return `${username[0]}*@${domain}`;
  }
  return `${username[0]}${new Array(username.length - 1).fill('*').join('')}@${domain}`;
};

// 搜索文件
const handleFileSearch = () => {
  // 搜索功能通过computed属性filteredFiles实现
};

// 搜索文章
const handlePostSearch = () => {
  // 搜索功能通过computed属性filteredPosts实现
};

// 获取用户详细信息
const fetchUserDetail = async () => {
  const username = route.query.username as string;
  if (!username) {
    message.warning('无法获取用户信息');
    router.push('/');
    return;
  }
  
  loading.value = true;
  try {
    const response = await userService.getUserDetail(username);
    if (response.code === 200) {
      userInfo.value = response.data;
    } else {
      message.error(response.message || '获取用户信息失败');
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    message.error('获取用户信息失败，请稍后再试');
  } finally {
    loading.value = false;
  }
};

// 控制音频播放，确保同时只有一个音频在播放
const handleAudioPlay = (event: Event) => {
  const currentAudio = event.target as HTMLAudioElement;
  
  // 获取所有音频元素
  const allAudios = document.querySelectorAll('audio');
  
  // 暂停其他正在播放的音频
  allAudios.forEach(audio => {
    if (audio !== currentAudio && !audio.paused) {
      audio.pause();
    }
  });
};

// 控制视频播放，确保同时只有一个视频在播放
const handleVideoPlay = (event: Event) => {
  const currentVideo = event.target as HTMLVideoElement;
  
  // 获取所有视频元素
  const allVideos = document.querySelectorAll('video');
  
  // 暂停其他正在播放的视频
  allVideos.forEach(video => {
    if (video !== currentVideo && !video.paused) {
      video.pause();
    }
  });
  
  // 同时也暂停所有音频
  const allAudios = document.querySelectorAll('audio');
  allAudios.forEach(audio => {
    if (!audio.paused) {
      audio.pause();
    }
  });
};

// 跳转到文章详情页面
const goToPostDetail = (postTitle: string) => {
  router.push({
    path: '/post/detail',
    query: { text: postTitle }
  });
};

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserDetail();
});
</script>

<style scoped>
.user-detail-container {
  max-width: 1000px;
  margin: 24px auto;
  padding: 0 24px;
}

.user-detail-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.posts-card, .files-card {
  margin-top: 24px;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.post-title {
  color: #1890ff;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.post-title:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.post-card {
  height: 100%;
  margin-bottom: 16px;
}

/* 文件展示样式 */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.file-item {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.file-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.picture-item {
  position: relative;
}

.preview-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.audio-item, .video-item {
  padding: 16px;
  display: flex;
  align-items: flex-start;
}

.file-icon {
  font-size: 24px;
  margin-right: 16px;
  color: #1890ff;
}

.file-info {
  flex: 1;
}

.file-name {
  padding: 8px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.audio-item .file-name,
.video-item .file-name {
  margin-bottom: 8px;
  font-weight: 500;
}

audio, video {
  width: 100%;
  margin-top: 8px;
}

.file-search {
  margin-bottom: 16px;
}
</style> 
<template>
  <div>
    <NavBar />
    <div class="profile-container">
      <a-card class="profile-card" title="个人中心" :loading="loading">
        <template #extra>
          <a-button type="primary" @click="showEditModal" :disabled="loading">
            编辑资料
          </a-button>
        </template>
        
        <a-descriptions bordered>
          <a-descriptions-item label="用户头像" :span="3">
            <div class="avatar-container">
              <a-avatar :size="80" :src="userInfo.avatarUrl">
                {{ userInfo.nickname?.charAt(0) || userInfo.username?.charAt(0) || 'U' }}
              </a-avatar>
            </div>
          </a-descriptions-item>
          
          <a-descriptions-item label="用户名">
            {{ userInfo.username }}
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
            {{ userInfo.phone || '暂未设置' }}
          </a-descriptions-item>
          
          <a-descriptions-item label="邮箱">
            {{ userInfo.email || '暂未设置' }}
          </a-descriptions-item>
          
          <a-descriptions-item label="编辑时间">
            {{ formatDateTime(userInfo.editTime) }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      
      <!-- 用户上传的文件列表 -->
      <a-card v-if="hasUploadedFiles" class="profile-card files-card" title="我上传的文件" :loading="loading">
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
          <a-tab-pane v-if="filteredFiles.picture && filteredFiles.picture.length > 0" key="picture" tab="图片">
            <div class="file-grid">
              <div v-for="(file, index) in filteredFiles.picture" :key="`picture-${index}`" class="file-item picture-item">
                <img :src="getFileUrl(file.filePath)" :alt="file.fileName" class="preview-image" />
                <div class="file-name">{{ file.fileName }}</div>
              </div>
            </div>
            <a-empty v-if="filteredFiles.picture.length === 0" description="没有找到匹配的文件" />
          </a-tab-pane>
          
          <!-- 音频文件 -->
          <a-tab-pane v-if="filteredFiles.audio && filteredFiles.audio.length > 0" key="audio" tab="音频">
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
            <a-empty v-if="filteredFiles.audio.length === 0" description="没有找到匹配的文件" />
          </a-tab-pane>
          
          <!-- 视频文件 -->
          <a-tab-pane v-if="filteredFiles.video && filteredFiles.video.length > 0" key="video" tab="视频">
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
            <a-empty v-if="filteredFiles.video.length === 0" description="没有找到匹配的文件" />
          </a-tab-pane>
          
          <!-- 如果没有任何类型的文件 -->
          <template v-if="!filteredFiles.picture?.length && !filteredFiles.audio?.length && !filteredFiles.video?.length">
            <a-empty description="暂无上传文件" />
          </template>
        </a-tabs>
      </a-card>
    </div>
    
    <!-- 编辑资料模态框 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑个人资料"
      :confirmLoading="submitting"
      @ok="handleEditSubmit"
      @cancel="handleEditCancel"
      width="600px"
    >
      <a-form
        :model="editForm"
        :rules="rules"
        ref="editFormRef"
        layout="vertical"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="editForm.username" disabled />
          <div class="text-secondary">用户名不可修改</div>
        </a-form-item>
        
        <a-form-item label="头像" name="avatarUrl">
          <div class="avatar-upload">
            <a-upload
              name="avatar"
              list-type="picture-card"
              :show-upload-list="false"
              :before-upload="beforeAvatarUpload"
              @change="handleAvatarChange"
            >
              <div v-if="editForm.avatarUrl">
                <img :src="editForm.avatarUrl" alt="avatar" style="width: 100%" />
              </div>
              <div v-else>
                <plus-outlined />
                <div style="margin-top: 8px">上传头像</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>
        
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="editForm.nickname" placeholder="请输入昵称" />
        </a-form-item>
        
        <a-form-item label="性别" name="gender">
          <a-radio-group v-model:value="editForm.gender">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
            <a-radio :value="0">保密</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="个人简介" name="profile">
          <a-textarea 
            v-model:value="editForm.profile" 
            placeholder="请输入个人简介"
            :rows="4"
            :maxLength="200"
            show-count
          />
        </a-form-item>
        
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="editForm.phone" placeholder="请输入手机号" />
        </a-form-item>
        
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        
        <a-divider />
        
        <a-form-item label="密码修改" style="margin-bottom: 0">
          <p class="text-secondary">如需修改密码，请填写以下信息</p>
        </a-form-item>
        
        <a-form-item label="原密码" name="rawPassword">
          <a-input-password v-model:value="editForm.rawPassword" placeholder="请输入原密码" />
        </a-form-item>
        
        <a-form-item label="新密码" name="password">
          <a-input-password v-model:value="editForm.password" placeholder="请输入新密码" />
        </a-form-item>
        
        <a-form-item label="确认新密码" name="confirmPassword">
          <a-input-password v-model:value="editForm.confirmPassword" placeholder="请再次输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import type { FormInstance } from 'ant-design-vue';
import { PlusOutlined, SoundOutlined, VideoCameraOutlined } from '@ant-design/icons-vue';
import { authService, userService } from '@/services';
import NavBar from '@/components/NavBar.vue';
import { UserDTO } from '@/types';

// 文件信息接口
interface FileInfo {
  fileName: string;
  filePath: string;
}

// 文件列表映射接口
interface FileListMap {
  picture?: FileInfo[];
  audio?: FileInfo[];
  video?: FileInfo[];
}

const router = useRouter();
const loading = ref(false);
const submitting = ref(false);
const editModalVisible = ref(false);
const userInfo = ref<any>({});
const userFilesMap = ref<FileListMap>({});
const fileSearchText = ref('');
const editFormRef = ref<FormInstance>();

// 过滤后的文件列表
const filteredFiles = computed(() => {
  if (!fileSearchText.value.trim()) {
    return userFilesMap.value;
  }

  const searchTerm = fileSearchText.value.toLowerCase();
  const result: FileListMap = {};

  // 过滤图片
  if (userFilesMap.value.picture) {
    result.picture = userFilesMap.value.picture.filter(
      file => file.fileName.toLowerCase().includes(searchTerm)
    );
  }

  // 过滤音频
  if (userFilesMap.value.audio) {
    result.audio = userFilesMap.value.audio.filter(
      file => file.fileName.toLowerCase().includes(searchTerm)
    );
  }

  // 过滤视频
  if (userFilesMap.value.video) {
    result.video = userFilesMap.value.video.filter(
      file => file.fileName.toLowerCase().includes(searchTerm)
    );
  }

  return result;
});

// 判断用户是否有上传的文件
const hasUploadedFiles = computed(() => {
  return (
    (userFilesMap.value.picture && userFilesMap.value.picture.length > 0) ||
    (userFilesMap.value.audio && userFilesMap.value.audio.length > 0) ||
    (userFilesMap.value.video && userFilesMap.value.video.length > 0)
  );
});

// 获取文件完整URL
const getFileUrl = (filePath: string) => {
  const baseUrl = process.env.VUE_APP_API_BASE_URL || '';
  return `${baseUrl}/${filePath}`;
};

// 编辑表单
const editForm = ref<any>({
  nickname: '',
  gender: 0,
  profile: '',
  phone: '',
  email: '',
  avatarUrl: '',
  rawPassword: '',
  password: '',
  confirmPassword: ''
});

// 验证确认密码
const validateConfirmPassword = async (_rule: any, value: string) => {
  if (value && value !== editForm.value.password) {
    return Promise.reject('两次输入的密码不一致');
  }
  return Promise.resolve();
};

// 验证密码修改
const validatePasswordChange = async (_rule: any, value: string) => {
  if (value && !editForm.value.rawPassword) {
    return Promise.reject('请输入原密码');
  }
  return Promise.resolve();
};

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { max: 20, message: '昵称长度不能超过20个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { min: 6, max: 20, message: '密码长度必须在6-20个字符之间', trigger: 'blur' },
    { validator: validatePasswordChange, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
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

// 格式化日期时间
const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '暂无';
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (e) {
    return dateStr;
  }
};

// 获取用户详细信息
const fetchUserDetail = async () => {
  if (!authService.isLoggedIn()) {
    message.warning('请先登录');
    router.push('/login');
    return;
  }
  
  const username = authService.getCurrentUsername();
  if (!username) {
    message.warning('无法获取用户信息');
    return;
  }
  
  loading.value = true;
  try {
    const response = await userService.getUserDetail(username);
    if (response.code === 200) {
      userInfo.value = response.data;
      
      // 处理用户上传的文件列表
      if (response.data.fileListMap) {
        userFilesMap.value = response.data.fileListMap as unknown as FileListMap;
      }
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

// 显示编辑模态框
const showEditModal = () => {
  // 将当前用户信息填充到编辑表单
  editForm.value = {
    username: userInfo.value.username || '',
    nickname: userInfo.value.nickname || '',
    gender: userInfo.value.gender || 0,
    profile: userInfo.value.profile || '',
    phone: userInfo.value.phone || '',
    email: userInfo.value.email || '',
    avatarUrl: userInfo.value.avatarUrl || '',
    rawPassword: '',
    password: '',
    confirmPassword: ''
  };
  
  editModalVisible.value = true;
};

// 头像上传前检查
const beforeAvatarUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('头像只能是 JPG/PNG 格式!');
  }
  
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('头像必须小于 2MB!');
  }
  
  return isJpgOrPng && isLt2M;
};

// 头像变化处理
const handleAvatarChange = (info: any) => {
  if (info.file.status === 'uploading') {
    return;
  }
  
  if (info.file.status === 'done') {
    // 如果后端返回了URL
    if (info.file.response && info.file.response.url) {
      editForm.value.avatarUrl = info.file.response.url;
    } else {
      // 使用本地预览
      getBase64(info.file.originFileObj, (url: string) => {
        editForm.value.avatarUrl = url;
      });
    }
  }
};

// 转换图片为Base64
const getBase64 = (img: File, callback: (base64Url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

// 提交编辑表单
const handleEditSubmit = async () => {
  try {
    await editFormRef.value?.validate();
    
    submitting.value = true;
    
    // 构造更新用户信息的请求对象
    const updateData: UserDTO = {
      username: editForm.value.username, // 包含用户名
      nickname: editForm.value.nickname,
      gender: editForm.value.gender,
      profile: editForm.value.profile,
      phone: editForm.value.phone,
      email: editForm.value.email,
      avatarUrl: editForm.value.avatarUrl
    };
    
    // 如果有填写密码相关信息，添加到请求中
    if (editForm.value.rawPassword && editForm.value.password) {
      updateData.rawPassword = editForm.value.rawPassword;
      updateData.password = editForm.value.password;
    }
    
    const response = await userService.updateUserInfo(updateData);
    
    if (response.code === 200) {
      message.success('更新个人资料成功');
      editModalVisible.value = false;
      
      // 重新获取用户信息
      await fetchUserDetail();
    } else {
      message.error(response.message || '更新个人资料失败');
    }
  } catch (error) {
    console.error('更新个人资料失败:', error);
    message.error('更新个人资料失败，请稍后再试');
  } finally {
    submitting.value = false;
  }
};

// 取消编辑
const handleEditCancel = () => {
  editModalVisible.value = false;
  editForm.value = {
    username: '',
    nickname: '',
    gender: 0,
    profile: '',
    phone: '',
    email: '',
    avatarUrl: '',
    rawPassword: '',
    password: '',
    confirmPassword: ''
  };
};

// 搜索文件
const handleFileSearch = () => {
  // 搜索功能通过computed属性filteredFiles实现
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

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserDetail();
});
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 24px auto;
  padding: 0 24px;
}

.profile-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.files-card {
  margin-top: 24px;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin: 8px 0;
}

.avatar-upload {
  text-align: center;
}

.text-secondary {
  color: #666;
  font-size: 14px;
  margin: 0;
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
  display: flex;
  flex-direction: column;
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
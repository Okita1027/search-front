<template>
  <div>
    <NavBar />
    <div class="search-container">
      <!-- 搜索区域 -->
      <div class="search-area">
        <a-select
          v-model:value="selectedEngine"
          class="search-engine-select"
        >
          <a-select-option value="default">系统检索</a-select-option>
          <a-select-option value="baidu">百度</a-select-option>
          <a-select-option value="bing">Bing</a-select-option>
          <a-select-option value="yandex">Yandex</a-select-option>
          <a-select-option value="google">Google</a-select-option>
          <a-select-option value="bilibili">哔哩哔哩</a-select-option>
          <a-select-option value="mita">秘塔AI搜索</a-select-option>
          <!-- <a-select-option value="sohu">搜狐</a-select-option> -->
        </a-select>

        <a-auto-complete
          autofocus="true"
          backfill="true"
          v-model:value="searchText"
          :options="suggestions"
          class="search-input"
          @focus="onSearch"
          @search="onSearch"
          @select="onSelect"
          @keydown="onKeyDown"
        />

        <a-button
          type="primary"
          class="search-button"
          @click="handleSearch"
        >
          搜&nbsp;&nbsp;索
        </a-button>
      </div>

      <MyDivider />

      <!-- 内容区域 -->
      <div class="content-area">
        <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
          <template #rightExtra>
            <a-button type="primary" @click="handleUploadClick" class="ant-btn">
              <template #icon>
                <upload-outlined />
              </template>
              上传文件
            </a-button>
          </template>

          <a-tab-pane key="post" tab="文章">
            <PostList :post-list="postList" />
          </a-tab-pane>
          <a-tab-pane key="picture" tab="图片">
            <PictureList :picture-list="pictureList" />
          </a-tab-pane>
          <a-tab-pane key="user" tab="用户">
            <UserList :user-list="userList" />
          </a-tab-pane>
          <a-tab-pane key="audio" tab="音频">
            <AudioList :audio-list="audioList" />
          </a-tab-pane>
          <a-tab-pane key="video" tab="视频">
            <VideoList :video-list="videoList" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <!-- 上传文件模态框 -->
    <a-modal
      v-model:visible="uploadModalVisible"
      title="上传文件"
      @ok="handleUploadOk"
      :confirmLoading="confirmLoading"
      @cancel="handleUploadCancel"
    >
      <a-form
        :model="uploadForm"
        :rules="uploadRules"
        ref="uploadFormRef"
        layout="vertical"
      >
        <a-form-item label="文件" name="file">
          <a-upload-dragger
            name="file"
            :before-upload="beforeUpload"
            @change="handleFileChange"
            :showUploadList="true"
            :maxCount="5"
            :fileList="fileList"
            :multiple="true"
          >
            <p class="ant-upload-drag-icon">
              <inbox-outlined />
            </p>
            <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p class="ant-upload-hint">
              支持 JPG/PNG 图片、MP3/FLAC 音频或 MP4/WebM 视频文件，文件大小不超过100MB，最多可同时上传5个文件
            </p>
          </a-upload-dragger>
        </a-form-item>

        <!-- 文件预览区域 -->
        <div v-if="fileList.length > 0" class="file-preview">
          <h3>文件列表</h3>
          <div v-for="(file, index) in fileList" :key="index" class="file-info">
            <file-outlined />
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
            <a-progress
              :percent="100"
              status="active"
              v-if="file.status === 'uploading'"
            />
          </div>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import PostList from "@/components/PostList.vue";
import PictureList from "@/components/PictureList.vue";
import UserList from "@/components/UserList.vue";
import MyDivider from "@/components/MyDivider.vue";
import NavBar from "@/components/NavBar.vue";
import { useRoute, useRouter } from "vue-router";
import { message, UploadProps } from "ant-design-vue";
import AudioList from "@/components/AudioList.vue";
import VideoList from "@/components/VideoList.vue";
import { FileOutlined, InboxOutlined, UploadOutlined } from "@ant-design/icons-vue";
import {
  audioService,
  authService,
  fileUploadService,
  pictureService,
  postService,
  userService,
  videoService
} from "@/services";
import { Audio, Picture, Post, User, Video } from "@/types";

const postList = ref<Post[]>([]);
const userList = ref<User[]>([]);
const pictureList = ref<Picture[]>([]);
const audioList = ref<Audio[]>([]);
const videoList = ref<Video[]>([]);
const suggestions = ref<{ value: string }[]>([]);
const searchText = ref(""); // 存储输入框的搜索文本
const activeKey = ref("post"); // 当前激活的 Tab，默认为文章 Tab
const selectedEngine = ref("default");

const route = useRoute();
const router = useRouter();

const initSearchParams = {
  text: ""
};
const searchParams = ref(initSearchParams);

// 使用localStorage确保欢迎消息只显示一次
if (!localStorage.getItem("welcomeShown")) {
  message.info("欢迎使用聚合搜索平台！");
  localStorage.setItem("welcomeShown", "true");
}

// 加载不同类型的数据（文章、用户、图片、音频、视频）
const loadData = async (params: any) => {
  // 加载文章数据
  if (activeKey.value === "post") {
    const response = await postService.getPostList(params);
    postList.value = response.data;
  }
  // 加载用户数据
  if (activeKey.value === "user") {
    const response = await userService.getUserList(params);
    userList.value = response.data;
  }
  // 加载图片数据
  if (activeKey.value === "picture") {
    const response = await pictureService.getPictureList(params);
    pictureList.value = response.data;
  }
  // 加载音频数据
  if (activeKey.value === "audio") {
    const response = await audioService.getAudioList(params);
    audioList.value = response.data;
  }
  // 加载视频数据
  if (activeKey.value === "video") {
    const response = await videoService.getVideoList(params);
    videoList.value = response.data;
  }
};

// 根据路由的变化加载数据
watchEffect(() => {
  searchParams.value = {
    ...initSearchParams,
    text: (route.query.text as string) || ""
  };
  loadData(searchParams.value);
});

// 当搜索框的文本发生变化时，调用后端接口获取搜索建议
const onSearch = async (value: string) => {
  // 清空建议列表，如果输入框为空
  if (!value.trim()) {
    suggestions.value = [];
    return;
  }

  // 根据选中的 Tab 获取建议
  if (activeKey.value === "post" && value.trim()) {
    try {
      const response = await postService.getPostSuggestion(value);
      suggestions.value = response.data.map((item: string) => ({
        value: item
      }));
    } catch (error) {
      message.error("获取搜索建议失败");
    }
  }
};

// 当选择某个搜索建议时，发送请求获取最终数据
const onSelect = async (selectedText: string) => {
  try {
    const response = await postService.getPostList({ text: selectedText });
    postList.value = response.data;
  } catch (error) {
    message.error("获取文章失败");
  }
};

// 点击搜索按钮时，基于当前选中的标签发送不同的请求
const handleSearch = async () => {
  if (!searchText.value.trim()) return;

  // 如果选择了外部搜索引擎，则跳转到对应的搜索引擎
  if (selectedEngine.value !== "default") {
    let searchUrl = "";
    const searchQuery = encodeURIComponent(searchText.value);

    switch (selectedEngine.value) {
      case "baidu":
        searchUrl = `https://www.baidu.com/s?wd=${searchQuery}`;
        break;
      case "bing":
        searchUrl = `https://www.bing.com/search?q=${searchQuery}`;
        break;
      case "yandex":
        searchUrl = `https://yandex.com/search/?text=${searchQuery}`;
        break;
      case "google":
        searchUrl = `https://www.google.com/search?q=${searchQuery}`;
        break;
      case "mita":
        searchUrl = `https://metaso.cn/#/search?q=${searchQuery}`;
        break;
      // case "sohu":
      //   searchUrl = `https://www.sohu.com/search?keyword=${searchQuery}`;
      //   break;
      case "bilibili":
        searchUrl = `https://search.bilibili.com/all?keyword=${searchQuery}`;
        break;
    }

    if (searchUrl) {
      window.open(searchUrl, "_self");
      return;
    }
  }

  // 如果是默认搜索引擎，则在本系统内进行搜索
  const params = { text: searchText.value };

  // 根据 activeKey 确定请求的接口
  if (activeKey.value === "post") {
    try {
      const response = await postService.getPostList(params);
      postList.value = response.data;
    } catch (error) {
      message.error("获取文章失败");
    }
  } else if (activeKey.value === "picture") {
    try {
      const response = await pictureService.getPictureList(params);
      pictureList.value = response.data;
    } catch (error) {
      message.error("获取图片失败");
    }
  } else if (activeKey.value === "user") {
    try {
      const response = await userService.getUserList(params);
      userList.value = response.data;
    } catch (error) {
      message.error("获取用户失败");
    }
  } else if (activeKey.value === "audio") {
    try {
      const response = await audioService.getAudioList(params);
      audioList.value = response.data;
    } catch (error) {
      message.error("获取音频失败");
    }
  } else if (activeKey.value === "video") {
    try {
      const response = await videoService.getVideoList(params);
      videoList.value = response.data;
    } catch (error) {
      message.error("获取视频失败");
    }
  }
};

// 监听回车键事件触发搜索
const onKeyDown = (event: KeyboardEvent) => {
  // 检查是否按下回车键 (keyCode 13 或 event.key === 'Enter')
  if (event.key === "Enter") {
    handleSearch(); // 执行搜索
  }
};

// 切换 Tab 时更新请求参数，并清空建议候选项
const onTabChange = async (key: string) => {
  // 清空搜索建议
  suggestions.value = [];
  // 若搜索框为空，不触发任何请求
  if (searchText.value.length == 0) {
    return;
  }
  // 传递 text 查询参数和 type 信息
  const params = { text: searchText.value };

  // 根据点击的 tab 来决定请求哪个接口
  if (key === "post") {
    const response = await postService.getPostList(params);
    postList.value = response.data;
  } else if (key === "user" && searchText.value !== "") {
    const response = await userService.getUserList(params);
    userList.value = response.data;
  } else if (key === "picture") {
    const response = await pictureService.getPictureList(params);
    pictureList.value = response.data;
  } else if (key === "audio") {
    const response = await audioService.getAudioList(params);
    audioList.value = response.data;
  } else if (key === "video") {
    const response = await videoService.getVideoList(params);
    videoList.value = response.data;
  }
  await router.push({
    path: `/${key}`,
    query: { text: searchText.value }
  });
};

// 页面切换函数
const onPageChange = () => {
  loadData({
    ...searchParams.value
  });
};

// 限制上传文件类型和大小
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  const isMp3OrFlac = file.type === "audio/mpeg" || file.type === "audio/flac";
  const isMp4OrWebm = file.type === "video/mp4" || file.type === "video/webm";
  const isValidType = isJpgOrPng || isMp3OrFlac || isMp4OrWebm;

  if (!isValidType) {
    message.error("只能上传 JPG/PNG 图片、MP3/FLAC 音频或 MP4/WebM 视频文件!");
  }

  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    message.error("文件必须小于 100MB!");
  }

  // 返回false阻止自动上传，只将文件添加到fileList中
  return false;
};

// 处理上传状态变化
const handleUploadChange: UploadProps["onChange"] = (info) => {
  if (info.file.status === "uploading") {
    message.loading("文件上传中...");
    return;
  }

  if (info.file.status === "done") {
    message.success(`${info.file.name} 上传成功!`);

    // 如果是在对应的标签页，刷新数据
    if (
      (info.file.type?.includes("image") && activeKey.value === "picture") ||
      (info.file.type?.includes("audio") && activeKey.value === "audio") ||
      (info.file.type?.includes("video") && activeKey.value === "video")
    ) {
      loadData(searchParams.value);
    }
  } else if (info.file.status === "error") {
    message.error(
      `${info.file.name} 上传失败: ${info.file.error || "未知错误"}`
    );
  }
};

// 添加新的上传文件功能
const uploadModalVisible = ref(false);
const confirmLoading = ref(false);
const uploadForm = ref({
  file: null as File | null
});
const uploadRules = {
  file: [{ required: true, message: "请选择要上传的文件" }]
};
const uploadFormRef = ref();
const fileList = ref<any[]>([]);

// 上传文件按钮点击事件
const handleUploadClick = () => {
  // 检查用户是否已登录
  if (!authService.isLoggedIn()) {
    message.warning("请先登录后再上传文件");
    // 跳转到登录页面
    router.push("/login");
    return;
  }

  // 清空文件列表
  fileList.value = [];
  // 已登录，显示上传模态框
  uploadModalVisible.value = true;
};

const handleUploadOk = async () => {
  if (!fileList.value.length) {
    message.error("请选择要上传的文件");
    return;
  }

  // 检查所有文件的大小
  const invalidFiles = fileList.value.filter(
    file => file.originFileObj && file.originFileObj.size / 1024 / 1024 >= 100
  );
  
  if (invalidFiles.length > 0) {
    message.error(`有${invalidFiles.length}个文件超过100MB大小限制!`);
    return;
  }

  confirmLoading.value = true;
  try {
    // 获取所有文件的originFileObj
    const filesToUpload = fileList.value
      .filter(file => file.originFileObj)
      .map(file => file.originFileObj);

    if (filesToUpload.length === 0) {
      message.error("没有有效的文件可上传");
      confirmLoading.value = false;
      return;
    }

    // 使用fileUploadService上传文件
    const fileUploadRequest = {
      file: filesToUpload.length === 1 ? filesToUpload[0] : filesToUpload
    };

    await fileUploadService.uploadFile(fileUploadRequest);

    // 上传成功
    message.success(`成功上传了${filesToUpload.length}个文件`);
    // 重置表单
    uploadForm.value = {
      file: null
    };
    fileList.value = [];
    // 关闭对话框
    uploadModalVisible.value = false;
    // 刷新数据
    loadData(searchParams.value);
  } catch (error: any) {
    message.error(`上传失败: ${error?.message || "未知错误"}`);
  } finally {
    confirmLoading.value = false;
  }
};

const handleUploadCancel = () => {
  // 重置表单
  uploadForm.value = {
    file: null
  };
  fileList.value = [];
  uploadModalVisible.value = false;
};

const beforeAvatarUpload = (file: File) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isJpgOrPng) {
    message.error("头像必须是 JPG/PNG 格式!");
  }
  if (!isLt10M) {
    message.error("头像文件必须小于 10MB!");
  }
  return isJpgOrPng && isLt10M;
};

const handleAvatarChange = (info: any) => {
  if (info.file.status === "done") {
    // 如果你的后端返回了URL
    if (
      info.file.response &&
      typeof info.file.response === "object" &&
      "url" in info.file.response
    ) {
      // This code is no longer used
    } else {
      // 如果没有返回URL，可以使用本地预览
      getBase64(info.file.originFileObj, (url: string) => {
        // This code is no longer used
      });
    }
    message.success(`${info.file.name} 上传成功!`);
  } else if (info.file.status === "error") {
    const errorMsg =
      typeof info.file.response === "object" &&
      info.file.response &&
      "message" in info.file.response
        ? info.file.response.message
        : "未知错误";
    message.error(`${info.file.name} 上传失败: ${errorMsg}`);
  }
};

// 辅助函数：将文件转换为Base64用于预览
const getBase64 = (file: File, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(file);
};

const handleFileChange = (info: any) => {
  // 保留所有上传的文件，最多5个
  fileList.value = info.fileList.slice(0, 5);
};

// 文件大小格式化函数
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  font-size: 1.5em; /* 文字放大1.5倍 */
}

.search-area {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
}

.search-engine-select {
  width: 150px; /* 放大1.5倍 */
  height: 50px; /* 调整高度 */
  line-height: 50px;
  font-size: 1em;
}

.search-input {
  width: 600px; /* 放大1.5倍 */
  height: 50px; /* 调整高度 */
  line-height: 40px;
  margin: 0 15px;
  font-size: 1.2em;
}

.search-button {
  width: 120px; /* 放大1.5倍 */
  height: 50px; /* 调整高度 */
  line-height: 50px;
  font-size: 1.2em;
}

.content-area {
  margin-top: 30px;
  font-size: 1em;
}


:deep(.ant-select-selector) {
  height: 100% !important;
}

:deep(.ant-select-selection-item) {
  height: 100% !important;
  line-height: inherit !important;
}

:deep(.ant-select-selection-search-input) {
  height: 100% !important;
}

:deep(.ant-btn) {
  height: 100% !important;
  line-height: 40px !important;
  font-size: 1.2em !important;
}

/* 调整标签页样式 */
:deep(.ant-tabs-tab) {
  font-size: 1.1em;
  padding: 12px 20px;
}

:deep(.ant-tabs-tab-btn) {
  font-weight: 500;
}

:deep(.ant-tabs-extra-content .ant-btn) {
  font-size: 1em;
  height: 40px;
  padding: 0 20px;
}

/* 调整结果列表的样式 */
:deep(.ant-list-item) {
  font-size: 1em;
  padding: 15px 0;
}

:deep(.ant-card) {
  font-size: 1em;
}

:deep(.ant-avatar) {
  width: 60px;
  height: 60px;
  line-height: 60px;
  font-size: 24px;
}

.file-preview {
  margin-top: 16px;
  padding: 16px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
}

.file-preview h3 {
  margin-bottom: 12px;
  color: #1890ff;
  font-size: 1.2em;
}

.file-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.file-name {
  margin-left: 8px;
  font-weight: 500;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: #999;
  margin-left: 8px;
}
</style>

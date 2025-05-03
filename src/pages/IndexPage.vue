<template>
  <!-- 无法单独改变组件的大小，故放大整个页面 -->
  <div style="transform: scale(1.5); margin-top: 25px; transform-origin: top">
    <!-- 写一个选择框，内容是百度、必应、谷歌、搜狗搜索地址 -->
    <a-select
      v-model:value="selectedEngine"
      style="
        width: 120px;
        margin-right: 45px;
        margin-left: 100px;
        transform: scale(1.2);
      "
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
      style="width: 425px; margin-left: 10px; transform: scale(1.2)"
      placeholder="请输入搜索关键词"
      @focus="onSearch"
      @search="onSearch"
      @select="onSelect"
      @keydown="onKeyDown"
    >
    </a-auto-complete>
    <a-button
      type="primary"
      style="width: 75px; margin-left: 50px; transform: scale(1.2)"
      @click="handleSearch"
    >
      搜&nbsp;&nbsp;索
    </a-button>
    <MyDivider />
    <!-- Tabs 切换 -->
    <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
      <template #rightExtra>
        <a-button type="primary" @click="showUploadModal">
          <template #icon>
            <upload-outlined />
          </template>
          上传文件
        </a-button>
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
            <a-form-item label="用户名" name="title">
              <a-input
                v-model:value="uploadForm.title"
                placeholder="请输入用户名"
              />
            </a-form-item>

            <a-form-item label="简介" name="profile">
              <a-textarea
                v-model:value="uploadForm.profile"
                placeholder="请输入简介"
                :rows="3"
              />
            </a-form-item>

            <a-form-item label="头像" name="avatarUrl">
              <a-upload
                name="avatar"
                list-type="picture-card"
                :show-upload-list="false"
                :before-upload="beforeAvatarUpload"
                @change="handleAvatarChange"
              >
                <img
                  v-if="uploadForm.avatarUrl"
                  :src="uploadForm.avatarUrl"
                  alt="avatar"
                  style="width: 100%"
                />
                <div v-else>
                  <plus-outlined />
                  <div style="margin-top: 8px">上传</div>
                </div>
              </a-upload>
            </a-form-item>

            <a-form-item label="文件" name="file">
              <a-upload-dragger
                name="file"
                :before-upload="beforeUpload"
                @change="handleFileChange"
                :showUploadList="true"
                :maxCount="1"
                :fileList="fileList"
                :multiple="false"
              >
                <p class="ant-upload-drag-icon">
                  <inbox-outlined />
                </p>
                <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p class="ant-upload-hint">
                  支持 JPG/PNG 图片或 MP3/FLAC 音频文件，文件大小不超过10MB
                </p>
              </a-upload-dragger>
            </a-form-item>
          </a-form>
        </a-modal>
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
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import PostList from "@/components/PostList.vue";
import PictureList from "@/components/PictureList.vue";
import UserList from "@/components/UserList.vue";
import MyDivider from "@/components/MyDivider.vue";
import { useRoute, useRouter } from "vue-router";
import { message, UploadProps } from "ant-design-vue";
import AudioList from "@/components/AudioList.vue";
import { InboxOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons-vue";
import { audioService, fileUploadService, pictureService, postService, userService } from "@/services";
import { Audio, Picture, Post, User } from "@/types";

const postList = ref<Post[]>([]);
const userList = ref<User[]>([]);
const pictureList = ref<Picture[]>([]);
const audioList = ref<Audio[]>([]);
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

// 加载不同类型的数据（文章、用户、图片）
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
  const isValidType = isJpgOrPng || isMp3OrFlac;

  if (!isValidType) {
    message.error("只能上传 JPG/PNG 图片或 MP3/FLAC 音频文件!");
  }

  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error("文件必须小于 10MB!");
  }

  return isValidType && isLt10M;
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
      (info.file.type?.includes("audio") && activeKey.value === "audio")
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
  title: "",
  profile: "",
  avatarUrl: "",
  file: null as File | null
});
const uploadRules = {
  title: [{ required: true, message: "请输入用户名" }],
  profile: [{ max: 100, message: "简介长度不能超过100个字符" }]
};
const uploadFormRef = ref();
const fileList = ref<any[]>([]);

const showUploadModal = () => {
  uploadModalVisible.value = true;
};

const handleUploadOk = async () => {
  if (!uploadForm.value.title) {
    message.error("请输入用户名");
    return;
  }

  if (!fileList.value.length || !fileList.value[0]?.originFileObj) {
    message.error("请选择要上传的文件");
    return;
  }

  confirmLoading.value = true;
  try {
    // 使用fileUploadService上传文件
    const fileUploadRequest = {
      title: uploadForm.value.title,
      profile: uploadForm.value.profile,
      avatarUrl: uploadForm.value.avatarUrl,
      file: fileList.value[0].originFileObj
    };

    await fileUploadService.uploadFile(fileUploadRequest);

    // 上传成功
    message.success("上传成功");
    // 重置表单
    uploadForm.value = {
      title: "",
      profile: "",
      avatarUrl: "",
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
    title: "",
    profile: "",
    avatarUrl: "",
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
      uploadForm.value.avatarUrl = info.file.response.url;
    } else {
      // 如果没有返回URL，可以使用本地预览
      getBase64(info.file.originFileObj, (url: string) => {
        uploadForm.value.avatarUrl = url;
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
  fileList.value = info.fileList.slice(-1);
  const file = info.file;

  if (file.status === "done") {
    message.success(`${file.name} 上传成功!`);
  } else if (file.status === "error") {
    const errorMsg =
      typeof file.response === "object" &&
      file.response &&
      "message" in file.response
        ? file.response.message
        : "未知错误";
    message.error(`${file.name} 上传失败: ${errorMsg}`);
  }
};
</script>

<style scoped></style>

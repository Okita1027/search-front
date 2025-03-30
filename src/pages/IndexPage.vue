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
      <a-select-option value="default">默认</a-select-option>
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
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";
import AudioList from "@/components/AudioList.vue";

const postList = ref([]);
const userList = ref([]);
const pictureList = ref([]);
const audioList = ref([]);
const suggestions = ref([]); // 用于存储搜索建议
const searchText = ref(""); // 存储输入框的搜索文本
const activeKey = ref("post"); // 当前激活的 Tab，默认为文章 Tab
const selectedEngine = ref("default");

const route = useRoute();
const router = useRouter();

const initSearchParams = {
  text: "",
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
    const response = await myAxios.get("/post", { params });
    postList.value = response.data;
  }
  // 加载用户数据
  if (activeKey.value === "user") {
    const response = await myAxios.get("/user", { params });
    userList.value = response.data;
  }
  // 加载图片数据
  if (activeKey.value === "picture") {
    const response = await myAxios.get("/picture", { params });
    pictureList.value = response.data;
  }
  // 加载音频数据
  if (activeKey.value === "audio") {
    const response = await myAxios.get("/file/audio", { params });
    audioList.value = response.data;
  }
};

// 根据路由的变化加载数据
watchEffect(() => {
  searchParams.value = {
    ...initSearchParams,
    text: (route.query.text as string) || "",
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
      const response = await myAxios.get("/post/suggestion", {
        params: { suggestText: value },
      });
      suggestions.value = response.data.map((item: string) => ({
        value: item,
      }));
    } catch (error) {
      message.error("获取搜索建议失败");
    }
  }
};

// 当选择某个搜索建议时，发送请求获取最终数据
const onSelect = async (selectedText: string) => {
  try {
    const response = await myAxios.get("/post", {
      params: { text: selectedText },
    });
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
      const response = await myAxios.get("/post", { params });
      postList.value = response.data;
    } catch (error) {
      message.error("获取文章失败");
    }
  } else if (activeKey.value === "picture") {
    try {
      const response = await myAxios.get("/picture", { params });
      pictureList.value = response.data;
    } catch (error) {
      message.error("获取图片失败");
    }
  } else if (activeKey.value === "user") {
    try {
      const response = await myAxios.get("/user", { params });
      userList.value = response.data;
    } catch (error) {
      message.error("获取用户失败");
    }
  } else if (activeKey.value === "audio") {
    try {
      const response = await myAxios.get("/file/audio", { params });
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
    const response = await myAxios.get("/post", { params });
    postList.value = response.data;
  } else if (key === "user" && searchText.value !== "") {
    const response = await myAxios.get("/user", { params });
    userList.value = response.data;
  } else if (key === "picture") {
    const response = await myAxios.get("/picture", { params });
    pictureList.value = response.data;
  } else if (key === "audio") {
    const response = await myAxios.get("/file/audio", { params });
    audioList.value = response.data;
  }
  await router.push({
    path: `/${key}`,
    query: { text: searchText.value },
  });
};

// 页面切换函数
const onPageChange = () => {
  loadData({
    ...searchParams.value,
  });
};
</script>

<style scoped></style>

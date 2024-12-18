<template>
  <!-- 无法单独改变组件的大小，故放大整个页面 -->
  <div style="transform: scale(1.5); transform-origin: top">
    <a-auto-complete
      autofocus="true"
      backfill="true"
      v-model:value="searchText"
      :options="suggestions"
      style="width: 875px"
      placeholder="请输入搜索关键词"
      @focus="onSearch"
      @search="onSearch"
      @select="onSelect"
    >
    </a-auto-complete>
    <a-button type="primary" @click="handleSearch"> 搜索</a-button>
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
    </a-tabs>
    <!-- 分页 -->
    <a-pagination
      v-model:current="pageNum"
      :total="totalNum"
      :simple="true"
      show-quick-jumper
    />
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

const pageNum = ref(2);
const totalNum = ref(500);
const postList = ref([]);
const userList = ref([]);
const pictureList = ref([]);
const suggestions = ref([]); // 用于存储搜索建议
const searchText = ref(""); // 存储输入框的搜索文本
const activeKey = ref("post"); // 当前激活的 Tab，默认为文章 Tab

const route = useRoute();
const router = useRouter();

const initSearchParams = {
  text: "",
};

const searchParams = ref(initSearchParams);

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
};

// 根据路由的变化加载数据
watchEffect(() => {
  searchParams.value = {
    ...initSearchParams,
    text: route.query.text,
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
  if (searchText.value.trim()) {
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
    }
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
  }

  await router.push({
    path: `/${key}`,
    query: { text: searchText.value },
  });
};
</script>

<style scoped></style>

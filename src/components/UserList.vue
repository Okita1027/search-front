<template>
  <a-list
    item-layout="horizontal"
    :grid="{ gutter: 15, xs: 1, sm: 2, md: 4, lg: 4, xl: 5, xxl: 3 }"
    :data-source="props.userList"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <a-card hoverable style="width: 240px" @click="viewUserDetail(item.username)">
          <template #cover>
            <img alt="头像" :src="item.avatarUrl" />
          </template>
          <a-card-meta :title="item.nickname">
            <template #description>{{ item.profile || '暂无简介' }}</template>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import { useRouter } from "vue-router";
import { UserVO } from "@/types";

interface Props {
  userList: UserVO[];
}

const props = withDefaults(defineProps<Props>(), {
  userList: () => [],
});

const router = useRouter();

// 查看用户详情
const viewUserDetail = (username: string) => {
  router.push({
    path: '/user/detail',
    query: { username }
  });
};
</script>

<style scoped>
.ant-card {
  cursor: pointer;
  transition: all 0.3s;
}

.ant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>

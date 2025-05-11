<template>
  <a-list item-layout="horizontal" :data-source="props.postList">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta :description="truncateContent(item.content)">
          <template #title>
            <a @click="goToDetail(item.title)" class="post-title">
              <span v-html="item.title"></span>
            </a>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import { useRouter } from "vue-router";

interface Props {
  postList: any[];
  maxContentLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  postList: () => [],
  maxContentLength: 150
});

const router = useRouter();

const truncateContent = (content: string) => {
  if (!content) return '';
  if (content.length <= props.maxContentLength) return content;
  return content.substring(0, props.maxContentLength) + '...';
};

const goToDetail = (title: string) => {
  router.push({
    path: "/post/detail",
    query: { text: title },
  });
};
</script>

<style>
em {
  color: red;
}

.post-title {
  cursor: pointer;
  color: #1890ff;
}

.post-title:hover {
  text-decoration: underline;
}
</style>

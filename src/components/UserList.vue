<template>
  <a-list
    item-layout="horizontal"
    :grid="{ gutter: 15, xs: 1, sm: 2, md: 4, lg: 4, xl: 5, xxl: 3 }"
    :data-source="props.userList"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <a-card hoverable style="width: 240px">
          <template #cover>
            <img alt="头像" :src="item.avatarUrl" />
          </template>
          <a-card-meta :title="item.userName">
            <template #description>{{ item.profile }}</template>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";

interface Props {
  userList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  userList: () => [],
});
</script>

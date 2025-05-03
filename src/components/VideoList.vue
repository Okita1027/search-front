<template>
  <a-list
    :data-source="props.videoList"
    :grid="{ gutter: 10, column: 3 }"
    item-layout="horizontal"
  >
    <template #renderItem="{ item, index }">
      <a-list-item>
        <a-card hoverable>
          <template #cover>
            <video 
              :id="`video-${index}`" 
              controls 
              @play="handlePlay(index)"
              style="width: 100%; max-height: 200px;"
            >
              <source :src="item.filePath" type="video/mp4" />
              您的浏览器不支持视频标签
            </video>
          </template>
          <a-card-meta>
            <template #title>
              <div :title="item.fileName" class="video-title">
                {{ item.fileName }}
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { defineProps, ref, withDefaults } from "vue";
import { Video } from "@/types";

interface Props {
  videoList: Video[];
}

const props = withDefaults(defineProps<Props>(), {
  videoList: () => [],
});

// 当前播放的视频索引
const currentPlayingIndex = ref(-1);

// 处理视频播放事件
const handlePlay = (index: number) => {
  // 如果有其他视频正在播放且不是当前点击的视频
  if (currentPlayingIndex.value !== -1 && currentPlayingIndex.value !== index) {
    // 获取之前播放的视频元素并暂停它
    const previousVideo = document.getElementById(
      `video-${currentPlayingIndex.value}`
    ) as HTMLVideoElement;
    if (previousVideo) {
      previousVideo.pause();
    }
  }
  // 更新当前播放的视频索引
  currentPlayingIndex.value = index;
};
</script>

<style scoped>
.video-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  font-size: 14px;
  line-height: 1.5;
}

.a-card {
  width: 100%;
}
</style> 
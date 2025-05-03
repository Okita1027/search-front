<template>
  <a-list
    :data-source="props.audioList"
    :grid="{ gutter: 10, column: 3 }"
    item-layout="horizontal"
  >
    <template #renderItem="{ item, index }">
      <a-list-item>
        <a-card hoverable>
          <template #cover>
            <audio :id="`audio-${index}`" controls @play="handlePlay(index)">
              <source :src="item.filePath" type="audio/mpeg" />
            </audio>
          </template>
          <a-card-meta>
            <template #title>
              <div :title="item.fileName" class="music-title">
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

interface Props {
  audioList: any[];
}

const props = withDefaults(defineProps<Props>(), {
  audioList: () => [],
});

// 当前播放的音频索引
const currentPlayingIndex = ref(-1);

// 处理音频播放事件
const handlePlay = (index: number) => {
  // 如果有其他音频正在播放且不是当前点击的音频
  if (currentPlayingIndex.value !== -1 && currentPlayingIndex.value !== index) {
    // 获取之前播放的音频元素并暂停它
    const previousAudio = document.getElementById(
      `audio-${currentPlayingIndex.value}`
    ) as HTMLAudioElement;
    if (previousAudio) {
      previousAudio.pause();
    }
  }
  // 更新当前播放的音频索引
  currentPlayingIndex.value = index;
};
</script>

<style scoped>
.music-title {
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

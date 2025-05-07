<template>
  <div class="post-detail-container">
    <!-- 文章详情区 -->
    <a-card v-if="postDetail" class="post-detail-card">
      <template #title>
        <h1 class="post-title">{{ postDetail.title }}</h1>
        <div class="post-meta">
          <span>作者: {{ postDetail.createBy }}</span>
          <span>创建时间: {{ formatDate(postDetail.createTime) }}</span>
          <span>更新时间: {{ formatDate(postDetail.updateTime) }}</span>
        </div>
      </template>
      <div class="post-content">{{ postDetail.content }}</div>
    </a-card>

    <!-- 加载中状态 -->
    <a-card v-else>
      <a-skeleton active />
    </a-card>

    <!-- 评论区 -->
    <a-card title="评论区" class="comments-card">
      <a-comment-list>
        <template v-if="commentGroups.length > 0">
          <div
            v-for="(group, groupIndex) in commentGroups"
            :key="groupIndex"
            class="comment-group"
          >
            <!-- 主评论 -->
            <a-comment
              :author="group.main.currentNickname"
              :content="group.main.content"
              :datetime="formatDate(group.main.createTime)"
            >
              <template #actions>
                <span class="comment-like" @click="handleLike(group.main)">
                  <like-outlined />
                  <span style="padding-left: 4px">{{
                    group.main.likeCount
                  }}</span>
                </span>
                <span class="comment-reply" @click="replyToComment(group.main)"
                  >回复</span
                >
              </template>

              <!-- 回复列表 -->
              <template v-if="group.replies && group.replies.length > 0">
                <!-- 默认显示前2条回复 -->
                <a-comment
                  v-for="(reply, replyIndex) in getVisibleReplies(group)"
                  :key="`${groupIndex}-${replyIndex}`"
                  :author="reply.currentNickname"
                  :content="formatReplyContent(reply)"
                  :datetime="formatDate(reply.createTime)"
                >
                  <template #actions>
                    <span class="comment-like" @click="handleLike(reply)">
                      <like-outlined />
                      <span style="padding-left: 4px">{{
                        reply.likeCount
                      }}</span>
                    </span>
                    <span class="comment-reply" @click="replyToComment(reply)"
                      >回复</span
                    >
                  </template>
                </a-comment>

                <!-- 展开/折叠按钮 -->
                <div v-if="group.replies.length > 2" class="expand-replies">
                  <a-button type="link" @click="toggleExpand(groupIndex)">
                    {{
                      expandedGroups[groupIndex]
                        ? "收起"
                        : `展开全部 ${group.replies.length} 条回复`
                    }}
                  </a-button>
                </div>
              </template>
            </a-comment>
          </div>
        </template>
        <a-empty v-else description="暂无评论" />
      </a-comment-list>

      <!-- 添加评论区域 -->
      <div class="comment-editor">
        <h3>{{ replyTo ? `回复 ${replyTo.currentNickname}` : "发表评论" }}</h3>
        <a-form layout="vertical">
          <a-form-item>
            <a-textarea
              v-model:value="commentContent"
              :rows="4"
              placeholder="请输入评论内容..."
            />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button v-if="replyTo" @click="cancelReply">取消回复</a-button>
              <a-button type="primary" @click="submitComment">提交</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { LikeOutlined } from "@ant-design/icons-vue";
import { postService } from "@/services";
import { Post, PostComment } from "@/types";

// 定义文章详情和评论类型
interface Comment {
  commentId: string;
  content: string;
  parentUsername: string | null;
  parentNickname: string | null;
  currentUsername: string;
  currentNickname: string;
  createTime: string;
  likeCount: string;
}

interface CommentGroup {
  main: Comment;
  replies: Comment[];
}

interface PostDetail {
  title: string;
  content: string;
  createBy: string;
  createTime: string;
  updateTime: string;
  commentLikeDtoMap: Record<string, Comment[]>;
}

const route = useRoute();
const postDetail = ref<PostDetail | null>(null);
const commentContent = ref("");
const replyTo = ref<Comment | null>(null);
// 记录每个讨论组的展开状态
const expandedGroups = ref<Record<number, boolean>>({});

// 获取文章详情
const fetchPostDetail = async () => {
  try {
    const response = await postService.getPostDetail({ text: route.query.text as string });
    postDetail.value = response.data;
  } catch (error) {
    console.error("获取文章详情失败:", error);
    message.error("获取文章详情失败");
  }
};

// 根据楼层号对评论进行分组
const commentGroups = computed(() => {
  if (!postDetail.value?.commentLikeDtoMap) return [];

  const groups: CommentGroup[] = [];

  // 遍历每个讨论组
  Object.entries(postDetail.value.commentLikeDtoMap).forEach(
    ([groupId, comments]) => {
      if (comments.length === 0) return;

      // 找出该讨论组的发起者（parentUsername为null或空字符串的评论）
      const mainComment = comments.find(
        (c) => !c.parentUsername || c.parentUsername === ""
      );

      if (mainComment) {
        // 找出所有回复这个主评论的评论
        const replies = comments.filter(
          (c) => c.commentId !== mainComment.commentId
        );

        groups.push({
          main: mainComment,
          replies: replies,
        });
      }
    }
  );

  return groups;
});

// 获取可见的回复评论（默认显示前2条，展开后显示全部）
const getVisibleReplies = (group: CommentGroup) => {
  const groupIndex = commentGroups.value.findIndex((g) => g === group);
  if (groupIndex === -1) return [];

  // 如果展开状态为true，显示全部回复；否则只显示前2条
  return expandedGroups.value[groupIndex]
    ? group.replies
    : group.replies.slice(0, 2);
};

// 切换展开/折叠状态
const toggleExpand = (groupIndex: number) => {
  expandedGroups.value[groupIndex] = !expandedGroups.value[groupIndex];
};

// 日期格式化
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateStr;
  }
};

// 格式化回复内容，显示回复给谁
const formatReplyContent = (reply: Comment) => {
  if (reply.parentNickname) {
    return `回复 @${reply.parentNickname}: ${reply.content}`;
  }
  return reply.content;
};

// 回复评论
const replyToComment = (comment: Comment) => {
  replyTo.value = comment;
  document
    .querySelector(".comment-editor")
    ?.scrollIntoView({ behavior: "smooth" });
};

// 取消回复
const cancelReply = () => {
  replyTo.value = null;
};

// 处理点赞
const handleLike = (comment: Comment) => {
  // 这里预留点赞功能的实现
  console.log("点赞评论:", comment.commentId);
  message.info("点赞功能即将上线");
};

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) {
    message.warning("评论内容不能为空");
    return;
  }

  try {
    // 构造评论请求参数
    const params = {
      postId: postDetail.value?.id || '',
      content: commentContent.value,
      parentUsername: replyTo.value?.currentUsername || null,
      parentNickname: replyTo.value?.currentNickname || null,
    };

    // 使用service发送请求
    await postService.addPostComment(params);

    message.success("评论发布成功");
    commentContent.value = "";
    replyTo.value = null;

    // 重新获取文章详情，刷新评论列表
    fetchPostDetail();
  } catch (error) {
    console.error("评论发布失败:", error);
    message.error("评论发布失败");
  }
};

// 页面加载时获取文章详情
onMounted(() => {
  fetchPostDetail();
});
</script>

<style scoped>
.post-detail-container {
  max-width: 1000px;
  margin: 20px auto;
}

.post-detail-card {
  margin-bottom: 20px;
}

.post-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.post-meta {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
}

.post-content {
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-line;
}

.comments-card {
  margin-top: 20px;
}

.comment-group {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 24px;
  margin-bottom: 24px;
}

.comment-group:last-child {
  border-bottom: none;
}

.comment-like,
.comment-reply {
  cursor: pointer;
  color: #1890ff;
}

.comment-like:hover,
.comment-reply:hover {
  color: #40a9ff;
}

.expand-replies {
  margin-top: 8px;
  margin-left: 48px;
}

.comment-editor {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>

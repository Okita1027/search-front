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
        <div v-if="replyTo" class="reply-info">
          <div class="reply-target">
            <a-tag color="blue">回复给: {{ replyTo.currentNickname }}</a-tag>
            <a-button type="link" size="small" @click="cancelReply">取消回复</a-button>
          </div>
          <p class="reply-content">{{ replyTo.content }}</p>
        </div>
        <a-form layout="vertical">
          <a-form-item>
            <a-textarea
              v-model:value="commentContent"
              :rows="4"
              placeholder="请输入评论内容..."
              :maxLength="500"
              showCount
            />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button
                v-if="replyTo"
                @click="cancelReply"
              >
                取消回复
              </a-button>
              <a-button
                type="primary"
                @click="submitComment"
                :loading="submitting"
                class="comment-submit-btn"
              >
                {{ submitting ? '提交中...' : '提交' }}
              </a-button>
            </a-space>
          </a-form-item>
        </a-form>
        <div v-if="!authService.isLoggedIn()" class="login-tip">
          <a-alert
            message="提示：登录后才能发表评论"
            type="info"
            show-icon
          />
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { LikeOutlined } from "@ant-design/icons-vue";
import { authService, postService, userService } from "@/services";

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

// 自定义文章详情接口
interface PostDetailData {
  id: string;
  title: string;
  content: string;
  createBy: string;
  createTime: string;
  updateTime: string;
  commentLikeDtoMap: Record<string, Comment[]>;
}

const route = useRoute();
const postDetail = ref<PostDetailData | null>(null);
const commentContent = ref("");
const replyTo = ref<Comment | null>(null);
const submitting = ref(false);
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
          replies: replies
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
      minute: "2-digit"
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
const handleLike = async (comment: Comment) => {
  try {
    // 检查用户是否已登录
    if (!authService.isLoggedIn()) {
      message.warning("请先登录后才能点赞");
      return;
    }
    
    // 调用点赞API
    const commentId = parseInt(comment.commentId);
    const response = await userService.favorComment(commentId);

    // 临时更新UI中的点赞数，等待后续接口刷新
    comment.likeCount = (parseInt(comment.likeCount) + 1).toString();

    // 重新获取文章详情，刷新评论列表
    await fetchPostDetail();
    message.success("点赞成功");
  } catch (error) {
    console.error("点赞失败:", error);
    message.error("点赞失败，请稍后再试");
  }
};

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim()) {
    message.warning("评论内容不能为空");
    return;
  }

  try {
    // 检查用户是否已登录
    if (!authService.isLoggedIn()) {
      message.warning("请先登录后才能评论");
      return;
    }
    
    submitting.value = true;
    
    // 获取文章标题
    const articleTitle = postDetail.value?.title || '';
    // 获取父评论ID（如果是回复）
    const parentCommentId = replyTo.value ? parseInt(replyTo.value.commentId) : 0;
    // 评论内容
    const content = commentContent.value;

    // 使用userService.comment方法发送评论请求
    const response = await userService.comment(articleTitle, parentCommentId, content);
    
    if (response.code === 200) {
      message.success("评论发布成功");
      
      // 清空内容和回复状态
      commentContent.value = "";
      replyTo.value = null;
      
      // 重新获取文章详情，刷新评论列表
      await fetchPostDetail();
      
      // 滚动到评论区域
      setTimeout(() => {
        document.querySelector('.comments-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      message.error(response.message || "评论发布失败");
    }
  } catch (error) {
    console.error("评论发布失败:", error);
    message.error("评论发布失败，请稍后再试");
  } finally {
    submitting.value = false;
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
  transition: background-color 0.3s;
}

.comment-group:last-child {
  border-bottom: none;
}

.comment-group:hover {
  background-color: #f9f9f9;
}

.comment-group.new-comment {
  animation: highlight-comment 2s ease-in-out;
}

@keyframes highlight-comment {
  0% { background-color: #e6f7ff; }
  100% { background-color: transparent; }
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

.reply-info {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.reply-target {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.reply-content {
  margin-bottom: 10px;
  color: #595959;
  font-style: italic;
}

.login-tip {
  margin-top: 10px;
}

.ant-comment-actions {
  margin-top: 8px;
}

.ant-comment-content-detail {
  padding: 8px 0;
}
</style>

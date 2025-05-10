/**
 * 文章信息
 */
export interface Article {
  id: number;
  title: string;
  content: string;
  createTime: string;
  updateTime: string;
  createBy: string;
  updateBy: string;
  isDeleted: number;
}

/**
 * 文章结果（搜索页）
 */
export interface ArticleVO {
  title: string;
  content: string;
}

/**
 * 文章详情（详情页）
 */
export interface ArticleDetailVO extends ArticleVO {
  createBy: string;
  createTime: string;
  updateTime: string;
  commentLikeDtoMap: CommentLikeDtoMap;
}

/**
 * 文章详情页面的评论信息
 */
export interface CommentLikeDto {
  commentId: number;
  content: string;
  parentUsername: string;
  parentNickname: string;
  currentUsername: string;
  currentNickname: string;
  createTime: string;
  likeCount: number;
}

export interface CommentLikeDtoMap {
  [key: string]: CommentLikeDto[];
}

/**
 * 文章查询参数
 */
export interface PostSearchParams {
  text: string;
}

/**
 * 文章评论
 */
export interface PostComment {
  id: string;
  content: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  createTime?: string;
}

/**
 * 添加评论参数
 */
export interface AddCommentParams {
  postId: string;
  content: string;
} 
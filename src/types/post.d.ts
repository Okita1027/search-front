/**
 * 文章信息
 */
export interface Post {
  id: string;
  title: string;
  content?: string;
  tags?: string[];
  userId?: string;
  createTime?: string;
  updateTime?: string;
  thumbNum?: number;
  favourNum?: number;
}

/**
 * 文章详情
 */
export interface PostDetail extends Post {
  comments?: PostComment[];
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
 * 文章查询参数
 */
export interface PostSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
  userId?: string;
  notId?: string;
  tags?: string[];
}

/**
 * 添加评论参数
 */
export interface AddCommentParams {
  postId: string;
  content: string;
} 
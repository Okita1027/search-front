/**
 * 文章信息
 */
export interface Post {
  id: bigint;
  title?: string;
  content?: string;
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  updateBy?: string;
  isDeleted?: bigint;
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
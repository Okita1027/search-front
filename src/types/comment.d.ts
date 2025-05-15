/**
 * 文章评论对象
 */
export interface ArticleComment {
  id: number;
  articleId: number;
  serialNumber: number;
  parentUsername: string;
  parentNickname: string;
  currentUsername: string;
  currentNickname: string;
  content: string;
  createTime: string;
  updateTime: string;
  createBy: string;
  updateBy: string;
  isDeleted: number;
  articleTitle: string;
}

/**
 * 评论删除参数
 */
export interface DeleteCommentParams {
  id: number;
} 
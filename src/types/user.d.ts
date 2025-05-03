/**
 * 用户信息
 */
export interface User {
  id: string;
  nickName: string;
  profile?: string;
  avatarUrl?: string;
  createTime?: string;
  updateTime?: string;
}

/**
 * 用户查询参数
 */
export interface UserSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
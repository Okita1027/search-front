/**
 * 用户信息
 */
export interface User {
  id?: bigint;
  username?: string;
  password?: string;
  nickName?: string;
  gender?: bigint;
  profile?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  favorComment?: string[];
  status?: bigint;
  editTime?: string;
  createTime?: string;
  updateTime?: string;
  isDeleted?: bigint;
}

/**
 * 用户查询参数
 */
export interface UserSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
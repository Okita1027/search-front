/**
 * 用户信息
 */
export interface User {
  id?: string;
  username?: string;
  password?: string;
  nickname?: string;
  gender?: number; // 0保密，1男性，2女性
  profile?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  favorComment?: string;
  status?: number; // 0停用，1启用
  editTime?: string;
  createTime?: string;
  updateTime?: string;
  isDeleted?: number;
}

/**
 * 用户DTO
 */
export interface UserDTO extends User {
  rawPassword?: string; // 原始密码，用于修改密码
}

/**
 * 用户显示对象
 */
export interface UserVO {
  nickname: string;
  profile: string;
  avatarUrl: string;
}

/**
 * 用户查询参数
 */
export interface UserSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
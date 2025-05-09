/**
 * 用户信息（用户中心页面）
 */
export interface User {
  id?: string;
  username?: string;  // 用户名
  password?: string;  // 密码
  nickname?: string;  // 昵称
  gender?: number; // 0保密，1男性，2女性
  profile?: string;  // 个人简介
  phone?: string;    // 手机号
  email?: string;    // 邮箱
  avatarUrl?: string; // 头像（地址）
  favorComment?: string;  // 点过赞的评论ID（数组形式）
  status?: number; // 0停用，1启用
  editTime?: string;  // 用户最近一次自己编辑个人信息的时间
  createTime?: string;
  updateTime?: string;
  isDeleted?: number;
}

/**
 * 用户DTO（编辑用户个人详细信息）
 */
export interface UserDTO extends User {
  rawPassword?: string; // 原始密码，用于修改密码
}

/**
 * 用户显示对象（首页搜索页面）
 */
export interface UserVO {
  nickname: string;
  profile: string;
  avatarUrl: string;
}

/**
 * 用户详情对象（用户中心页面）
 * TODO any类型需要更改成包含 fileName、filePath的对象类型
 */
export interface UserDetailVO extends User {
  // KEY:文件类型
  // VALUE:文件列表（fileName、filePath）
  fileListMap: Map<string, List<any>>;
}

/**
 * 用户查询参数（首页搜索页面）
 */
export interface UserSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
/**
 * 用户信息（用户中心页面）
 */
export interface User {
  username: string;
  password: string;
  id: number;
  nickname: string;
  gender: number;
  profile: string;
  phone: string;
  email: string;
  avatarUrl: string;
  favorComment: number[];
  status: number;
  editTime: string;
  createTime: string;
  updateTime: string;
  isDeleted: number;
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
 */
export interface UserDetailVO extends User {
  // KEY:文件类型
  // VALUE:文件列表（fileName、filePath）
  fileListMap: FileListMap;
}

/**
 * 用户查询参数（首页搜索页面）
 */
export interface UserSearchParams {
  text: string;
}

export interface FileInfo {
  fileName: string;
  filePath: string;
}

export interface FileListMap {
  picture?: FileInfo[];
  audio?: FileInfo[];
  video?: FileInfo[];
} 
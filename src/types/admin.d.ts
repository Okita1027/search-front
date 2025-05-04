/**
 * 管理员信息
 */
export interface Admin {
  id?: number;
  username?: string;
  password?: string;
  createTime?: string;
  updateTime?: string;
  isDeleted?: number;
}

export interface AdminVO {
  username: string;
}
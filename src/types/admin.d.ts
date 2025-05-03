/**
 * 管理员信息
 */
export interface Admin {
  id?: bigint;
  username?: string;
  password?: string;
  createTime?: string;
  updateTime?: string;
  isDeleted?: bigint;
}

export interface AdminVO {
  username: string;
}
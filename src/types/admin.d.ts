/**
 * 管理员信息
 */
export interface Admin {
  username: string;
  password: string;
  id: number;
  createTime: string;
  updateTime: string;
  isDeleted: number;
}

export interface AdminVO {
  username: string;
}

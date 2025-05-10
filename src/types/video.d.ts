/**
 * 视频信息
 */
export interface Video {
  id: number;
  fileName: string;
  filePath: string;
  createTime: string;
  updateTime: string;
  createBy: string;
  updateBy: string;
  isDeleted: number;
}

/**
 * 视频显示对象
 */
export interface VideoVO {
  fileName: string;
  filePath: string;
}

/**
 * 视频查询参数
 */
export interface VideoSearchParams {
  text: string;
} 
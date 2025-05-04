/**
 * 视频信息
 */
export interface Video {
  id?: string;
  fileName?: string;
  filePath?: string;
  title?: string;
  description?: string;
  tags?: string[];
  duration?: number;
  createTime?: string;
  updateTime?: string;
  userId?: string;
  isDeleted?: number;
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
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
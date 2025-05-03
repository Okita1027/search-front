/**
 * 视频信息
 */
export interface Video {
  id?: string;
  filePath?: string;
  fileName?: string;
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  updateBy?: string;
  isDeleted?: bigint;
}

/**
 * 视频查询参数
 */
export interface VideoSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
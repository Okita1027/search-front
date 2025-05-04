/**
 * 音频信息
 */
export interface Audio {
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
 * 音频显示对象
 */
export interface AudioVO {
  fileName: string;
  filePath: string;
}

/**
 * 音频查询参数
 */
export interface AudioSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
/**
 * 音频信息
 */
export interface Audio {
  id: string;
  url: string;
  title?: string;
  description?: string;
  tags?: string[];
  duration?: number;
  createTime?: string;
  userId?: string;
}

/**
 * 音频查询参数
 */
export interface AudioSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
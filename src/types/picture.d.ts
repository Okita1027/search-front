/**
 * 图片信息
 */
export interface Picture {
  id: string;
  url: string;
  title?: string;
  description?: string;
  tags?: string[];
  createTime?: string;
  userId?: string;
}

/**
 * 图片查询参数
 */
export interface PictureSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
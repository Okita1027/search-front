/**
 * 图片信息
 */
export interface Picture {
  id?: string;
  pictureUrl?: string;
  title?: string;
  description?: string;
  tags?: string[];
  createTime?: string;
  updateTime?: string;
  userId?: string;
  isDeleted?: number;
}

/**
 * 图片显示对象
 */
export interface PictureVO {
  pictureUrl: string;
}

/**
 * 图片查询参数
 */
export interface PictureSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
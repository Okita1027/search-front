/**
 * 图片信息
 */
export interface Picture {
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
 * 图片显示对象
 */
export interface PictureVO {
  pictureUrl: string;
}

/**
 * 图片查询参数
 */
export interface PictureSearchParams {
  text: string;
} 
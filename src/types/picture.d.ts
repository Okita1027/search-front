/**
 * 图片信息
 */
export interface Picture {
  id: bigint;
  fileName: string;
  filePath: string;
  source: bigint;
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  updateBy?: string;
  isDeleted?: bigint;
}

/**
 * 图片查询参数
 */
export interface PictureSearchParams {
  text?: string;
  pageNum?: number;
  pageSize?: number;
} 
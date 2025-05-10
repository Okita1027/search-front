/**
 * 音频信息
 */
export interface Audio {
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
  text: string;
} 
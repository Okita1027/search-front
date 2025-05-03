/**
 * 通用API响应格式
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页响应数据
 */
export interface PaginatedData<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
} 
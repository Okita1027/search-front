/**
 * 文件上传请求
 */
export interface FileUploadRequest {
  file: File | File[];
}

/**
 * 文件上传响应
 */
export interface FileUploadResponse {
  id: string;
  url?: string;
  fileName?: string;
  filePath?: string;
  type: string; // 'audio' | 'picture' | 'video' | 'other'
} 
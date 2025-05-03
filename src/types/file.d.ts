/**
 * 文件上传请求
 */
export interface FileUploadRequest {
  fileName: string;
  filePath: string;
  file: File;
}

/**
 * 文件上传响应
 */
export interface FileUploadResponse {
  id: string;
  url: string;
  title: string;
  type: string; // 'audio' | 'picture' | 'video' | 'other'
} 
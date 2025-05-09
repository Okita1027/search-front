import myAxios from '@/plugins/myAxios';
import { ApiResponse, FileUploadRequest, FileUploadResponse } from '@/types';

/**
 * 上传文件（视频、音频、图片）
 * @param data - 文件上传请求数据
 * @returns 上传结果
 */
const uploadFile = async (data: FileUploadRequest): Promise<ApiResponse<FileUploadResponse>> => {
  const formData = new FormData();
  
  if (Array.isArray(data.file)) {
    // 处理多文件上传
    data.file.forEach((file, index) => {
      formData.append(`file[${index}]`, file);
    });
  } else {
    // 处理单文件上传
    formData.append('file', data.file);
  }

  return await myAxios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default {
  uploadFile
}; 
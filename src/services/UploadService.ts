import myAxios from '@/plugins/myAxios';
import { ApiResponse, FileUploadRequest, FileUploadResponse } from '@/types';

/**
 * 上传文件（视频、音频、图片）
 * @param formData - 表单数据
 * @returns 上传结果
 */
const uploadFile = async (data: FileUploadRequest): Promise<ApiResponse<FileUploadResponse>> => {
  const formData = new FormData();
  formData.append('file', data.file);

  return await myAxios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default {
  uploadFile
}; 
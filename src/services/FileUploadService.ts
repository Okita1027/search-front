import myAxios from '@/plugins/myAxios';
import { ApiResponse, FileUploadRequest, FileUploadResponse } from '@/types';

/**
 * 上传文件
 * @param formData - 表单数据
 * @returns 上传结果
 */
const uploadFile = async (data: FileUploadRequest): Promise<ApiResponse<FileUploadResponse>> => {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.profile) {
    formData.append('profile', data.profile);
  }
  if (data.avatarUrl) {
    formData.append('avatarUrl', data.avatarUrl);
  }
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
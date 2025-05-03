import myAxios from '@/plugins/myAxios';

/**
 * 上传文件
 * @param formData - 表单数据
 */
const uploadFile = async (formData: FormData) => {
  return await myAxios.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export default {
  uploadFile
}; 
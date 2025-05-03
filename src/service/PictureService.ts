import myAxios from '@/plugins/myAxios';

/**
 * 获取图片列表
 * @param params - 请求参数
 */
const getPictureList = async (params: string) => {
  return await myAxios.get('/picture', { params });
};

export default {
  getPictureList
}; 
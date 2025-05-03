import myAxios from '@/plugins/myAxios';
import { ApiResponse, Picture, PictureSearchParams } from '@/types';

/**
 * 获取图片列表
 * @param params - 请求参数
 * @returns 图片列表
 */
const getPictureList = async (params: PictureSearchParams): Promise<ApiResponse<Picture[]>> => {
  return await myAxios.get('/picture', { params });
};

export default {
  getPictureList
}; 
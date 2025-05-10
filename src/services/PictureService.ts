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

/**
 * 获取图片列表（后台管理系统）
 * @return 图片列表（完整字段的数据）
 */
const getPictureListAll = async (): Promise<ApiResponse<Picture[]>> => {
  return await myAxios.get('/picture/list');
}

/**
 * 删除图片
 * @param fileName - 文件名
 * @returns 删除结果
 */
const deletePicture = async (fileName: string): Promise<ApiResponse<string>> => {
  return await myAxios.delete('/picture', { params: { fileName } });
}

export default {
  getPictureList,
  getPictureListAll,
  deletePicture,
}; 
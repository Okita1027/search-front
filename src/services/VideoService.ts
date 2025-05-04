import myAxios from '@/plugins/myAxios';
import { ApiResponse, Video, VideoSearchParams } from '@/types';

/**
 * 获取视频列表
 * @param params - 请求参数
 * @returns 视频列表
 */
const getVideoList = async (params: VideoSearchParams): Promise<ApiResponse<Video[]>> => {
  return await myAxios.get('/video', { params });
};

export default {
  getVideoList,
}; 
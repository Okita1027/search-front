import myAxios from '@/plugins/myAxios';
import { ApiResponse, Video, VideoSearchParams } from '@/types';

/**
 * 获取视频列表（搜索页）
 * @param params - 请求参数
 * @returns 视频列表
 */
const getVideoList = async (params: VideoSearchParams): Promise<ApiResponse<Video[]>> => {
  return await myAxios.get('/video', { params });
};

/**
 * 获取视频列表（后台管理系统）
 * @return 视频列表（完整字段的数据）
 */
const getVideoListAll = async (): Promise<ApiResponse<Video[]>> => {
  return await myAxios.get('/video/list');
}

/**
 * 删除视频
 * @param fileName - 文件名
 * @returns 删除结果
 */
const deleteVideo = async (fileName: string): Promise<ApiResponse<string>> => {
  return await myAxios.delete('/video', { params: { fileName } });
}

export default {
  getVideoList,
  getVideoListAll,
  deleteVideo,
}; 
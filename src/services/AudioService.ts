import myAxios from '@/plugins/myAxios';
import { ApiResponse, Audio, AudioSearchParams } from '@/types';

/**
 * 获取音频列表（搜索页）
 * @param params - 请求参数
 * @returns 音频列表
 */
const getAudioList = async (params: AudioSearchParams): Promise<ApiResponse<Audio[]>> => {
  return await myAxios.get('/audio', { params });
};

/**
 * 获取音频列表（后台管理系统）
 * @return 音频列表（完整字段的数据）
 */
const getAudioListAll = async (): Promise<ApiResponse<Audio[]>> => {
  return await myAxios.get('/audio/list');
}

/**
 * 删除音频
 * @param fileName - 文件名
 * @returns 删除结果
 */
const deleteAudio = async (fileName: string): Promise<ApiResponse<string>> => {
  return await myAxios.delete('/audio', { params: { fileName } });
}

export default {
  getAudioList,
  getAudioListAll,
  deleteAudio,
};
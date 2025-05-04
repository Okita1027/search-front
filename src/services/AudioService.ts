import myAxios from '@/plugins/myAxios';
import { ApiResponse, Audio, AudioSearchParams } from '@/types';

/**
 * 获取音频列表
 * @param params - 请求参数
 * @returns 音频列表
 */
const getAudioList = async (params: AudioSearchParams): Promise<ApiResponse<Audio[]>> => {
  return await myAxios.get('/audio', { params });
};


export default {
  getAudioList,
};
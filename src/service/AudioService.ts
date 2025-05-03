import myAxios from '@/plugins/myAxios';

/**
 * 获取音频列表
 * @param params - 请求参数
 */
const getAudioList = async (params: string) => {
  return await myAxios.get('/audio', { params });
};

export default {
  getAudioList,
};
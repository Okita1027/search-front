import myAxios from '@/plugins/myAxios';

/**
 * 获取用户列表
 * @param params - 请求参数
 */
const getUserList = async (params: string) => {
  return await myAxios.get('/user', { params });
};

export default {
  getUserList
};
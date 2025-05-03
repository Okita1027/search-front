import myAxios from '@/plugins/myAxios';
import { ApiResponse, User, UserSearchParams } from '@/types';

/**
 * 获取用户列表
 * @param params - 请求参数
 * @returns 用户列表
 */
const getUserList = async (params: UserSearchParams): Promise<ApiResponse<User[]>> => {
  return await myAxios.get('/user', { params });
};

export default {
  getUserList
};
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

/**
 * 用户注册
 * @param userData - 用户数据
 * @returns 注册结果
 */
const registerUser = async (userData: any): Promise<ApiResponse<any>> => {
  return await myAxios.post('/user/register', userData);
};

/**
 * 用户登录
 * @param loginData - 登录数据
 * @returns 登录结果和token信息
 */
const loginUser = async (loginData: { username: string, password: string }): Promise<ApiResponse<any>> => {
  return await myAxios.post('/user/login', loginData);
};

/**
 * 用户退出登录
 * @returns 退出结果
 */
const logoutUser = async (): Promise<ApiResponse<any>> => {
  return await myAxios.post('/user/logout');
};

/**
 * 获取用户信息
 * @param username - 用户名
 * @returns 用户信息
 */
const getUserInfo = async (username: string): Promise<ApiResponse<User>> => {
  return await myAxios.get('/user/info', { params: { username } });
};

/**
 * 更新用户信息
 * @param userData - 用户数据
 * @returns 更新结果
 */
const updateUserInfo = async (userData: any): Promise<ApiResponse<any>> => {
  return await myAxios.put('/user/info', userData);
};

/**
 * 评论点赞
 * @param commentId - 评论ID
 * @returns 点赞结果
 */
const favorComment = async (commentId: number): Promise<ApiResponse<any>> => {
  return await myAxios.post('/user/favor', null, { params: { commentId } });
};

export default {
  getUserList,
  registerUser,
  loginUser,
  logoutUser,
  getUserInfo,
  updateUserInfo,
  favorComment
};
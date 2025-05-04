import myAxios from '@/plugins/myAxios';
import { ApiResponse } from '@/types';

/**
 * 管理员登录
 * @param adminData - 管理员登录数据
 * @returns 登录结果和token信息
 */
const adminLogin = async (adminData: { username: string, password: string }): Promise<ApiResponse<any>> => {
  return await myAxios.post('/admin/login', adminData);
};

/**
 * 管理员退出登录
 * @returns 退出结果
 */
const adminLogout = async (): Promise<ApiResponse<any>> => {
  return await myAxios.post('/admin/logout');
};

/**
 * 踢出在线用户
 * @param tokenInfo - 用户token信息
 * @returns 操作结果
 */
const kickoutUser = async (tokenInfo: any): Promise<ApiResponse<any>> => {
  return await myAxios.post('/admin/kickout', null, { params: tokenInfo });
};

/**
 * 启用/封禁用户状态
 * @param username - 用户名
 * @param status - 状态值（0停用，1启用）
 * @returns 操作结果
 */
const changeUserStatus = async (username: string, status: number): Promise<ApiResponse<any>> => {
  return await myAxios.put('/admin/status', null, { params: { username, status } });
};

/**
 * 获取验证码
 * @param type - 验证码类型
 * @returns 验证码信息
 */
const generateCaptcha = async (type?: string): Promise<any> => {
  return await myAxios.get('/captcha/generate', { params: { type } });
};

/**
 * 校验验证码
 * @param data - 验证码数据
 * @returns 验证结果
 */
const checkCaptcha = async (data: any): Promise<any> => {
  return await myAxios.post('/captcha/check', data);
};

export default {
  adminLogin,
  adminLogout,
  kickoutUser,
  changeUserStatus,
  generateCaptcha,
  checkCaptcha
}; 
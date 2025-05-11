import { ApiResponse, SaTokenInfo } from "@/types";
import myAxios from "@/plugins/myAxios";

/**
 * 管理员登录
 * @param adminData - 管理员登录数据
 * @returns 登录结果和token信息
 */
const adminLogin = async (adminData: { username: string, password: string }): Promise<ApiResponse<string>> => {
  return await myAxios.post('/admin/login', adminData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * 管理员退出登录
 * @returns 退出结果
 */
const adminLogout = async (): Promise<ApiResponse<string>> => {
  return await myAxios.post('/admin/logout');
};

/**
 * 踢出在线用户
 * @param id - 用户ID
 * @returns 操作结果
 */
const kickoutUser = async (id: number): Promise<ApiResponse<string>> => {
  return await myAxios.post('/admin/kickout', null, { params: { id } });
};

/**
 * 启用/封禁用户状态
 * @param username - 用户名
 * @param status - 状态值（0停用，1启用）
 * @returns 操作结果
 */
const changeUserStatus = async (username: string, status: number): Promise<ApiResponse<string>> => {
  return await myAxios.put('/admin/status', null, { params: { username, status } });
};


/**
 * 删除用户
 * @param id - 用户ID
 * @returns 操作结果
 */
const deleteUser = async (id: number): Promise<ApiResponse<string>> => {
  return await myAxios.delete(`/admin/user`, { params: { id } });
}

export default {
  adminLogin,
  adminLogout,
  kickoutUser,
  changeUserStatus,
}
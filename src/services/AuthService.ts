import myAxios from '@/plugins/myAxios';
import { SaTokenInfo } from '@/types/auth';

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

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
const isLoggedIn = (): boolean => {
  const tokenInfo = localStorage.getItem('tokenInfo');
  if (!tokenInfo) return false;
  
  try {
    const saTokenInfo: SaTokenInfo = JSON.parse(tokenInfo);
    return saTokenInfo.isLogin === true;
  } catch (error) {
    return false;
  }
};

/**
 * 获取当前登录的用户ID
 * @returns 用户ID，未登录返回null
 */
const getCurrentUserId = (): string | null => {
  const tokenInfo = localStorage.getItem('tokenInfo');
  if (!tokenInfo) return null;
  
  try {
    const saTokenInfo: SaTokenInfo = JSON.parse(tokenInfo);
    return saTokenInfo.isLogin ? saTokenInfo.loginId : null;
  } catch (error) {
    return null;
  }
};

/**
 * 获取当前登录的用户名
 * @returns 用户名，未登录返回null
 */
const getCurrentUsername = (): string | null => {
  const tokenInfo = localStorage.getItem('tokenInfo');
  if (!tokenInfo) return null;
  
  try {
    const tokenData = JSON.parse(tokenInfo);
    return tokenData.username || null;
  } catch (error) {
    return null;
  }
};

/**
 * 获取token信息
 * @returns token信息对象
 */
const getTokenInfo = (): SaTokenInfo | null => {
  const tokenInfo = localStorage.getItem('tokenInfo');
  if (!tokenInfo) return null;
  
  try {
    return JSON.parse(tokenInfo);
  } catch (error) {
    return null;
  }
};

/**
 * 清除登录信息
 */
const clearLoginInfo = (): void => {
  localStorage.removeItem('tokenInfo');
};

export default {
  generateCaptcha,
  checkCaptcha,
  isLoggedIn,
  getCurrentUserId,
  getCurrentUsername,
  getTokenInfo,
  clearLoginInfo
}; 
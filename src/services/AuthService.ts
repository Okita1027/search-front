import myAxios from '@/plugins/myAxios';

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
  generateCaptcha,
  checkCaptcha
}; 
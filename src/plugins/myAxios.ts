import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types/common";

// 创建Axios实例
const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8888/api",
  timeout: 10000,
  headers: {

  }
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 如果设置了skipAuth，则跳过token验证
    if ((config as any).skipAuth) {
      return config;
    }

    // 从localStorage获取token信息
    const tokenInfoStr = localStorage.getItem('tokenInfo');
    if (tokenInfoStr) {
      try {
        const tokenInfo = JSON.parse(tokenInfoStr);
        // 将token添加到请求头
        if (tokenInfo.tokenName && tokenInfo.tokenValue) {
          config.headers[tokenInfo.tokenName] = tokenInfo.tokenValue;
        }
      } catch (error) {
        console.error('解析token信息失败', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    // 2xx 范围内的状态码都会触发该函数
    const data = response.data;
    
    // 处理嵌套的响应结构
    if (data && data.code !== undefined) {
      // 直接返回，不做处理，让业务代码处理
      return data as ApiResponse<any>;
    } else if (data && data.data && data.data.code !== undefined) {
      // 嵌套的响应，返回内层数据
      return data.data as ApiResponse<any>;
    }
    
    // 兜底返回
    return {
      code: 200,
      message: 'SUCCESS',
      data: data
    };
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
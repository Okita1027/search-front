import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ApiResponse } from "@/types/common";

// 创建Axios实例
const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8888/api",
  timeout: 10000,
  headers: {

  }
});

// 添加响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse): any => {
    // 2xx 范围内的状态码都会触发该函数
    const data = response.data as ApiResponse<any>;
    // 如果code为0，则返回data字段
    if (data.code === 0) {
      return Promise.resolve(data.data);
    }
    // 否则返回完整响应，让调用者处理
    console.error("request error", data);
    return Promise.resolve(data);
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
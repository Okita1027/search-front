/**
 * 登录令牌信息
 */
export interface SaTokenInfo {
  tokenName: string;
  tokenValue: string;
  isLogin: boolean;
  loginId: any;
  loginType: string;
  tokenTimeout: number;
  sessionTimeout: number;
  tokenSessionTimeout: number;
  tokenActiveTimeout: number;
  loginDeviceType: string;
  tag: string;
}


/**
 * 图片验证码
 */
export interface ImageCaptchaVO {
  type: string;
  backgroundImage: string;
  templateImage: string;
  backgroundImageTag: string;
  templateImageTag: string;
  backgroundImageWidth: number;
  backgroundImageHeight: number;
  templateImageWidth: number;
  templateImageHeight: number;
  data: any;
}

/**
 * 验证码响应
 */
export interface CaptchaResponse {
  id: string;
  captcha: ImageCaptchaVO;
}

/**
 * 验证码轨迹点
 */
export interface Track {
  x: number;
  y: number;
  t: number;
  type: string;
}

/**
 * 验证码校验数据
 */
export interface CaptchaVerifyData {
  id: string;
  data: {
    bgImageWidth: number;
    bgImageHeight: number;
    templateImageWidth: number;
    templateImageHeight: number;
    startTime: string;
    stopTime: string;
    left: number;
    top: number;
    trackList: Track[];
    data: any;
  };
} 
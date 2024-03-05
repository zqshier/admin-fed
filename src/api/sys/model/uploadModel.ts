export interface UploadApiResult {
  // message: string;
  // code: number;
  // url: string;
  url: string;
  width: number;
  height: number;
  size: number;
  mime: string;
}

export interface AliyunPolicy {
  host: string; //上传地址

  expire: number; //超时时间

  policy: string; //授权字段

  signature: string; //签名值

  accessId: string; //accessId

  dir: string; //上传目录

  callback: string; //上传回调参数

  cdn: string; //CDN地址
}

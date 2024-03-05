import { UploadApiResult, AliyunPolicy } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

const { uploadUrl = '' } = useGlobSetting();

enum Api {
  Policy = '/api/pt/app/tpms/aliyun/oss/policy',
}

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  );
}

// 阿里云OSS签名
export function getAliyunPolicy() {
  return defHttp.get<AliyunPolicy>({ url: Api.Policy });
}

// 阿里云OSS上传
export async function aliyunUpload(
  url: string,
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  const res = await defHttp.uploadFile<UploadApiResult>(
    {
      url,
      onUploadProgress,
    },
    params,
  );
  if (res.status === 200) {
    return res.data;
  }
  throw new Error('上传失败');
}

import type { UploadFile } from 'ant-design-vue';

export interface VideoInfo {
  id: Nullable<number>;
  url: string;
  thumb?: string;
  file?: Nullable<UploadFile>;
  uid?: string;
}

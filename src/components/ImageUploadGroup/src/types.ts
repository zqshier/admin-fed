import type { UploadFile } from 'ant-design-vue';

export interface ImageInfo {
  id: Nullable<number>;
  url: string;
  thumb?: string;
  file?: Nullable<UploadFile>;
  uid?: string;
}

export type SizeType = 'default' | 'small';

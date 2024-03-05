import { FormSchema } from '/@/components/Form/index';
import { getAppEnvConfig } from '/@/utils/env';
const { VITE_GLOB_VIDEO_CHANNEL_POSITIONS } = getAppEnvConfig();

export function getVideoChannelPositions() {
  const positions = VITE_GLOB_VIDEO_CHANNEL_POSITIONS
    ? VITE_GLOB_VIDEO_CHANNEL_POSITIONS.split(',')
    : [];
  const result: any = [];
  for (const p of positions) {
    if (typeof p === 'string') {
      const [label, value] = p.split('|');
      result.push({ label, value });
    }
  }
  return result;
}

const vcPositionsOptions = getVideoChannelPositions();

// 表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'status',
    label: '是否上下架',
    component: 'Switch',
  },
  {
    required: true,
    field: '[start, end]',
    label: '展示时间',
    component: 'RangePickerEx',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    required: true,
    field: 'reservationImage',
    label: '预约图片',
    component: 'ImageUpload',
    componentProps: { accept: 'image/jpeg,image/png,image/gif', maxCount: 1 },
  },
  {
    required: true,
    field: 'liveImage',
    label: '直播图片',
    component: 'ImageUpload',
    componentProps: { accept: 'image/jpeg,image/png,image/gif', maxCount: 1 },
  },
  {
    required: true,
    field: 'position',
    label: '露出位置',
    component: 'CheckboxGroup',
    componentProps: { options: vcPositionsOptions },
  },
];

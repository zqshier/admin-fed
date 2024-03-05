import { FormSchema } from '/@/components/Form/index';

// 表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'dailyPoints',
    label: '日签奖励',
    component: 'InputNumber',
    componentProps: { min: 0, max: 99999, addonAfter: '积分' },
  },
  {
    required: true,
    field: 'continuousRewards',
    label: '连续奖励',
    component: 'Input',
    slot: 'rowAwardSlot',
    rules: [
      {
        required: true,
        validator(_, value) {
          console.debug('value', value);
          if (!value?.length) return Promise.reject();
          let flag = false;
          value.forEach((item) => {
            if (item.days < 2 || item.points < 1) flag = true;
          });

          if (flag) return Promise.reject();
          return Promise.resolve();
        },
        message: '请完善连续奖励',
      },
    ],
  },
  {
    field: 'rules',
    label: '签到规则说明',
    component: 'ImageUploadGroup',
    componentProps: { tip: '图片大小不超过2M，只能是JPG、PNG、GIF格式，可拖拽图片调整显示顺序' },
  },
];

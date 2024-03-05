import { FormSchema } from '/@/components/Table';

export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'path',
    label: '小程序路径',
    component: 'Input',
    componentProps: {
      placeholder: '请输入小程序页面路径',
    },
  },
  {
    field: 'query',
    label: '参数',
    component: 'Input',
    componentProps: {
      placeholder: '请输入路径所带参数',
    },
  },
  {
    field: 'action',
    label: ' ',
    component: 'Input',
    slot: 'action',
  },
  {
    field: 'tip',
    label: ' ',
    component: 'Input',
    slot: 'tip',
  },
];

import dayjs from 'dayjs';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { isArray } from '/@/utils/is';

export const primaryKey = 'code';
export const pageTitle = '活动';

export function timeRender(text: string) {
  if (!text) return '-';
  return dayjs(text).format('YYYY.MM.DD HH:mm:ss');
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '活动名称',
    dataIndex: 'name',
  },
  {
    title: '关联券数',
    dataIndex: 'couponCount',
  },
  {
    title: '编号',
    dataIndex: 'code',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '活动名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '活动名称',
    component: 'Input',
  },
  {
    required: true,
    field: 'code',
    label: '编号',
    component: 'Input',
  },
  {
    required: true,
    field: '[list,deleteIds]',
    label: '活动券',
    component: 'Input',
    itemProps: {
      autoLink: false,
    },
    slot: 'coupon',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!isArray(value) || value.length !== 2) {
            return Promise.reject();
          }

          if (value[0].some((item: any) => item.validateStatus === 'error')) {
            return Promise.reject();
          }

          return Promise.resolve();
        },
        message: '请完善卡券信息',
      },
    ],
  },
];

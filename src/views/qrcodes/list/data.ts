import dayjs from 'dayjs';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '一物一码';

export enum AwardsType {
  'money' = 'money',
  'coupon' = 'coupon',
  'goods' = 'goods',
  'virtual' = 'virtual',
}

export const AwardsTypeList = [
  { label: '现金红包', value: AwardsType.money },
  { label: '实物奖品', value: AwardsType.goods },
  { label: '优惠券', value: AwardsType.coupon },
  { label: '虚拟奖品', value: AwardsType.virtual },
];

export function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '一物一码名称',
    dataIndex: 'name',
  },
  {
    title: '链接总数',
    dataIndex: 'amount',
  },
  {
    title: '已扫描链接数',
    dataIndex: 'scaned',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '一物一码名称',
    component: 'Input',
  },
  {
    required: true,
    field: 'page',
    label: '页面路径',
    component: 'Input',
    rules: [
      {
        required: true,
        validator: (_, value: string) => {
          if (value.charAt(0) !== '/') return Promise.reject();
          return Promise.resolve();
        },
        message: '页面路径不正确，请填写已有小程序页面路径',
      },
    ],
  },
];

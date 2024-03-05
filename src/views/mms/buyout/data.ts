import { Popconfirm, Switch } from 'ant-design-vue';
import dayjs from 'dayjs';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { buyoutPriceUpdate } from '/@/api/app/promotions';

export const primaryKey = 'promotionId';
export const pageTitle = '一口价';

export enum GroupUserType {
  'all' = 'all',
  'include' = 'include',
  'exclude' = 'exclude',
}

export const GroupUserTypeList = [
  { label: '全部用户', value: GroupUserType.all },
  { label: '部分用户可参与', value: GroupUserType.include },
  { label: '部分用户不可参与', value: GroupUserType.exclude },
];

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
    title: '活动时间',
    dataIndex: 'startTime',
    customRender: ({ record }: Recordable) =>
      timeRender(record.startTime) + ' -- ' + timeRender(record.endTime),
  },
  {
    title: '活动状态',
    dataIndex: 'disable',
    customRender: ({ record }: Recordable) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      const statusKey = 'disable';
      return h(
        Popconfirm,
        {
          title: `确定要${record[statusKey] ? '上架' : '下架'}吗？`,
          onConfirm: () => {
            if (record.pendingStatus) {
              return;
            }
            record.pendingStatus = true;
            const val = !record[statusKey];
            return buyoutPriceUpdate(record[primaryKey], { [statusKey]: val } as any)
              .then(() => {
                record[statusKey] = val;
              })
              .finally(() => (record.pendingStatus = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: !record[statusKey],
              checkedChildren: '上架',
              unCheckedChildren: '下架',
            }),
        },
      );
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '活动名称',
    component: 'Input',
  },
  {
    field: 'state',
    label: '活动状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '上架', value: 'enabled' },
        { label: '下架', value: 'disabled' },
      ],
    },
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
    field: '[startTime,endTime]',
    label: '活动时间',
    component: 'RangePickerEx',
    itemProps: {
      autoLink: false,
    },
  },
  {
    required: true,
    label: '价格名称',
    field: 'priceAlias',
    component: 'Input',
  },
  {
    required: true,
    label: '活动商品',
    field: 'goods',
    component: 'Input',
    slot: 'goods',
    itemProps: {
      autoLink: false,
    },
  },
  {
    label: '活动商品列表',
    field: 'showGoodsList',
    component: 'RadioGroup',
    defaultValue: true,
    componentProps: {
      options: [
        { label: '开启', value: true },
        { label: '关闭', value: false },
      ],
    },
  },
  {
    required: false,
    label: '活动用户',
    field: 'groupOption',
    component: 'Input',
    slot: 'groupUser',
    defaultValue: { type: GroupUserType.all, tagIds: [] },
    itemProps: {
      autoLink: false,
    },
  },
  {
    required: false,
    label: '优惠券限制',
    field: 'allowCouponUse',
    component: 'RadioGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '可使用优惠券', value: true },
        { label: '不可使用优惠券', value: false },
      ],
    },
  },
];

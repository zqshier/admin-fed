import { Popconfirm, Switch } from 'ant-design-vue';
import dayjs from 'dayjs';
import { h } from 'vue';
import { birthdayGiftsUpdate as updateApi } from '/@/api/app/mms';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { isArray } from '/@/utils/is';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';

export const primaryKey = 'id';
export const pageTitle = '生日礼';

export function timeRender(text: string) {
  if (!text) return '-';
  return dayjs(text).format('YYYY.MM.DD HH:mm:ss');
}

export enum TypeEnum {
  'coupon' = 'coupon',
  'point' = 'point',
}

export enum TimeTypeEnum {
  'forever' = 'forever',
  'fix' = 'fix',
}

export enum SendTimeTypeEnum {
  day = 0,
  month = 1,
}

export const TypeInfo = {
  coupon: '优惠券',
  point: '积分',
};

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '活动名称',
    dataIndex: 'name',
  },
  {
    title: '奖励类型',
    dataIndex: 'type',
    customRender: ({ value }) => {
      return TypeInfo[value] || '';
    },
  },
  {
    title: '奖励内容',
    dataIndex: 'value',
    customRender({ record }: Recordable) {
      if (record.type === TypeEnum.coupon) {
        return `优惠券[${record.value}]`;
      } else if (record.type === TypeEnum.point) {
        return record.value + '积分';
      }
    },
  },
  {
    title: '活动时间',
    dataIndex: 'start',
    customRender: ({ record }: Recordable) => {
      if (new Date(record.end).getFullYear() === 2999) {
        return '永久有效';
      }
      return `${timeRender(record.start)} - ${timeRender(record.end)}`;
    },
  },
  // {
  //   title: '活动状态',
  //   dataIndex: 'status',
  //   customRender: ({ record }: Recordable) => {
  //     return record.status === 'enabled' ? '已启用' : '已禁用';
  //   },
  // },
  {
    title: '活动状态',
    dataIndex: 'state',
    width: 100,
    customRender: ({ record }: Recordable) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(
        Popconfirm,
        {
          title: `确定要${record.disabled ? '上架' : '下架'}吗？`,
          onConfirm: () => {
            if (record.pendingStatus) {
              return;
            }
            record.pendingStatus = true;
            const state = record.state === 'enabled' ? 'disabled' : 'enabled';
            return updateApi(record.id, { state } as any)
              .then((res) => {
                record.state = res.state;
              })
              .finally(() => (record.pendingStatus = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: record.state === 'enabled',
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
        { label: '已启用', value: 'enabled' },
        { label: '已禁用', value: 'disabled' },
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
    field: '[timeType,start,end]',
    label: '活动时间',
    component: 'Input',
    slot: 'time',
    itemProps: {
      autoLink: false,
    },
  },
  {
    required: true,
    field: '[type,value]',
    label: '活动奖励',
    component: 'Input',
    itemProps: {
      autoLink: false,
    },
    slot: 'award',
    defaultValue: [TypeEnum.coupon, ''],
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!isArray(value) || value.length !== 2) {
            return Promise.reject();
          }

          if (!value[0] || !value[1]) return Promise.reject();

          return Promise.resolve();
        },
        message: '请填写完整',
      },
    ],
  },
  // {
  //   required: true,
  //   field: '[sendType,sendAt]',
  //   label: '发放时间',
  //   component: 'Input',
  //   slot: 'sendTime',
  //   itemProps: {
  //     autoLink: false,
  //   },
  // },
];

//详情表格
export const detailColumns: BasicColumn[] = [
  {
    title: '用户id',
    dataIndex: 'userId',
    customRender({ value }) {
      if (!value) return '';
      return h(OperatorInfo, {
        id: value,
        type: 'user',
        showType: false,
        block: true,
        showId: true,
      });
    },
  },
  {
    title: '发奖时间',
    dataIndex: 'createdAt',
    customRender: ({ value }) => {
      return timeRender(value);
    },
  },
  // {
  //   title: '发放内容',
  //   dataIndex: 'gift.name',
  // },
  {
    title: '发放结果',
    dataIndex: 'res',
  },
];

//详情搜索表单
export const detailSearchForm: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  {
    field: '[start,end]',
    label: '发奖时间',
    component: 'RangePickerEx',
  },
  {
    field: 'state',
    label: '发放结果',
    component: 'Select',
    componentProps: {
      options: [
        { label: '成功', value: 'success' },
        { label: '失败', value: 'failed' },
      ],
    },
  },
];

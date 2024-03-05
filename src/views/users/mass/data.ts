import dayjs from 'dayjs';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { isArray } from '/@/utils/is';

export const primaryKey = 'id';
export const pageTitle = '群发任务';

export function timeRender(text: string) {
  if (!text) return '-';
  return dayjs(text).format('YYYY.MM.DD HH:mm:ss');
}

export enum AwardTypeEnum {
  'coupon' = 'coupon',
  'point' = 'point',
}

export const AwardTypeInfo = {
  coupon: '优惠券',
  point: '积分',
};

export const TaskState = {
  pending: '准备号码包',
  prepared: '准备就绪',
  started: '发送中',
  success: '完成',
};

export enum ReceiveTypeEnum {
  'tag' = 'tag',
  'phone' = 'phone',
}

export const ReceiveTypeList = [
  { label: '指定标签', value: 'tag' },
  { label: '号码导入', value: 'phone' },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'name',
  },
  {
    title: '发放类型',
    dataIndex: 'type',
    customRender: ({ value }) => {
      return AwardTypeInfo[value] || '';
    },
  },
  {
    title: '发放内容',
    dataIndex: 'value',
    customRender({ record }: Recordable) {
      if (record.type === AwardTypeEnum.coupon) {
        return '优惠券: ' + record.value;
      } else if (record.type === AwardTypeEnum.point) {
        return record.value + '积分';
      }
    },
  },
  {
    title: '提交时间',
    dataIndex: 'createdAt',
    customRender: ({ record }: Recordable) => {
      return timeRender(record.createdAt);
    },
  },
  {
    title: '任务状态',
    dataIndex: 'status',
    customRender: ({ record }: Recordable) => {
      return TaskState[record.state];
    },
  },
  {
    title: '总数量',
    dataIndex: 'total',
  },
  {
    title: '发放数量',
    dataIndex: 'successed',
  },
  {
    title: '失败数量',
    dataIndex: 'failed',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '任务名称',
    component: 'Input',
  },
  {
    field: 'type',
    label: '发放类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '优惠券', value: AwardTypeEnum.coupon },
        { label: '积分', value: AwardTypeEnum.point },
      ],
    },
  },
  {
    field: 'state',
    label: '任务状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '准备号码包', value: 'pending' },
        { label: '准备就绪', value: 'prepared' },
        { label: '发送中', value: 'started' },
        { label: '发送完成', value: 'success' },
      ],
    },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '任务名称',
    component: 'Input',
  },
  {
    required: true,
    field: '[type,value]',
    label: '任务奖励',
    component: 'Input',
    itemProps: {
      autoLink: false,
    },
    slot: 'award',
    defaultValue: [AwardTypeEnum.coupon, ''],
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
  {
    required: true,
    field: 'receiveType',
    label: '接收类型',
    component: 'RadioGroup',
    defaultValue: ReceiveTypeEnum.tag,
    componentProps: {
      options: ReceiveTypeList,
    },
  },
  {
    required: true,
    field: 'tagIds',
    label: '指定标签',
    component: 'Input',
    slot: 'tags',
    itemProps: {
      autoLink: false,
    },
    ifShow({ values }) {
      return values.receiveType === ReceiveTypeEnum.tag;
    },
  },
  {
    required: true,
    field: 'file',
    label: '接收号码',
    component: 'Input',
    slot: 'importPhone',
    itemProps: {
      autoLink: false,
    },
    ifShow({ values }) {
      return values.receiveType === ReceiveTypeEnum.phone;
    },
  },
];

//详情表格
export const detailColumns: BasicColumn[] = [
  {
    title: '发放用户',
    dataIndex: 'userId',
  },
  {
    title: '发放时间',
    dataIndex: 'updatedAt',
    customRender: ({ value }) => {
      return timeRender(value);
    },
  },
  {
    title: '发放结果',
    dataIndex: 'res',
  },
];

//详情搜索表单
export const detailSearchForm: FormSchema[] = [
  {
    field: 'userId',
    label: '用户id/手机号',
    component: 'Input',
  },
];

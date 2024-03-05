import { h } from 'vue';
import { Switch, Popconfirm, Tag } from 'ant-design-vue';
import { format } from 'date-fns';
import { isArray } from '/@/utils/is';
import { drawLotsUpdate } from '/@/api/app/mms';
import { DrawLotsItems, DrawLotsParamsStatus } from '/@/api/app/model/mmsModel';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { FormActionType } from '/@/components/Form/index';
export interface StepActionType extends FormActionType {
  getDeleteImages: () => number[];
}
export interface IGoodsInputDataInfo {
  id?: number;
  goodsId: number;
  skuId: number;
  enableLimit: boolean;
  quantity?: number | string;
  price: string;
  goodsName?: string;
  goodsSku?: string;
  goodsPrice?: number;
  goodsStock?: number;
}

export enum STATUS_TEXT {
  WAIT = '待抽签',
  PROGRESS = '抽签中',
  WAIT_SELECT = '待抽选',
  PUBILISH = '已公布',
}

export const primaryKey = 'id';

export const awardStatus = [
  { label: '全部', value: '' },
  { label: '是', value: '1' },
  { label: '否', value: '0' },
];

export function statusText({ startAt, endAt, finishAt }) {
  const nowAt = new Date().getTime();
  if (nowAt < new Date(startAt).getTime()) return STATUS_TEXT.WAIT;
  if (nowAt > new Date(startAt).getTime() && nowAt < new Date(endAt).getTime())
    return STATUS_TEXT.PROGRESS;
  if (nowAt > new Date(endAt).getTime() && nowAt < new Date(finishAt).getTime())
    return STATUS_TEXT.WAIT_SELECT;
  if (nowAt > new Date(finishAt).getTime()) return STATUS_TEXT.PUBILISH;
  return '-';
}

export const statusColors = (status: string) => {
  switch (status) {
    case STATUS_TEXT.PUBILISH:
      return 'success';
    case STATUS_TEXT.PROGRESS:
      return 'processing';
    case STATUS_TEXT.WAIT_SELECT:
      return 'warning';
    case STATUS_TEXT.WAIT:
      return 'processing';
  }
  return 'default';
};

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '活动名称',
    dataIndex: 'name',
    ellipsis: false,
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    ellipsis: false,
    customRender: ({ record }: Recordable) => {
      const goods = record.goods;
      if (!goods || !goods.name) {
        return '';
      }
      return h('div', { class: 'flex items-center text-left' }, [h('div', goods.name)]);
    },
  },
  {
    title: '商品编码',
    dataIndex: 'goodsSn',
    customRender: ({ record }: Recordable) => {
      return record.goods?.sn || '';
    },
  },
  {
    title: '抽签时间',
    dataIndex: 'startAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
    },
  },
  {
    title: '抽签截止时间',
    dataIndex: 'endAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
    },
  },
  {
    title: '公布结果时间',
    dataIndex: 'finishAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }: any) => {
      const text = statusText({
        startAt: record.startAt,
        endAt: record.endAt,
        finishAt: record.finishAt,
      });
      return h(Tag, { color: statusColors(text) }, () => text);
    },
  },
  {
    title: '活动状态',
    dataIndex: 'activeStatus',
    width: 100,
    customRender: ({ record }: any) => {
      return h(
        Popconfirm,
        {
          title: `确定要${record.status === DrawLotsParamsStatus.active ? '下架' : '上架'}吗？`,
          onConfirm: () => {
            const newStatus =
              record.status === DrawLotsParamsStatus.active
                ? DrawLotsParamsStatus.inactive
                : DrawLotsParamsStatus.active;
            return drawLotsUpdate(record.id, { status: newStatus } as unknown as DrawLotsItems)
              .then(() => {
                record.status = newStatus;
              })
              .finally(() => {});
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: record.status === DrawLotsParamsStatus.active,
              checkedChildren: '已上架',
              unCheckedChildren: '已下架',
            }),
        },
      );
    },
  },
  {
    title: '抽选数量',
    dataIndex: 'drawCount',
  },
  {
    title: '销量',
    dataIndex: 'orderQuantity',
  },
  {
    title: '实际预约人数',
    dataIndex: 'bookingCount',
  },
  {
    title: '展示预约人数',
    dataIndex: 'bookingBase',
    key: 'bookingBase',
  },
  {
    title: '实际参与人数',
    dataIndex: 'participantCount',
  },
  {
    title: '展示参与人数',
    dataIndex: 'participantBase',
    key: 'participantBase',
  },
];

// step1 表单配置
export const formSchemaStep1: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '活动名称',
    defaultValue: '',
    component: 'Input',
  },
  {
    required: true,
    field: 'goods',
    label: '活动商品',
    component: 'Input',
    slot: 'goodsConfig',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!isArray(value) || (isArray(value) && value.length === 0)) {
            return Promise.reject('请选择活动商品');
          }

          const quantity = value.map((item: any) => item.quantity)[0];
          // console.debug(quantity);
          if (Number(quantity) <= 0) {
            return Promise.reject('抽选数量必须大于0');
          }

          return Promise.resolve();
        },
      },
    ],
  },
  {
    required: true,
    field: 'startAt',
    label: '参与抽签时间',
    component: 'Input',
    slot: 'startAtDatePicker',
  },
  {
    required: true,
    field: 'endAt',
    label: '抽签截止时间',
    component: 'Input',
    slot: 'endAtDatePicker',
  },
  {
    required: true,
    field: 'finishAt',
    label: '公布结果时间',
    component: 'Input',
    slot: 'finishAtDatePicker',
  },
];

// step2 表单配置
export const formSchemaStep2: FormSchema[] = [
  {
    required: true,
    field: 'bookingTemplateId',
    label: '预约通知配置',
    component: 'Input',
    slot: 'bookingTemplateId',
    itemProps: { wrapperCol: { span: 8 }, autoLink: false },
  },
  {
    required: true,
    field: 'bookingTemplateData',
    label: '示例',
    component: 'Input',
    slot: 'bookingTemplateData',
    itemProps: { autoLink: false },
    defaultValue: [],
    ifShow: ({ values }) => {
      return !!values.bookingTemplateId;
    },
  },
  {
    required: true,
    field: 'pickOnTemplateId',
    label: '中奖通知配置',
    component: 'Input',
    slot: 'pickOnTemplateId',
    itemProps: { wrapperCol: { span: 8 }, autoLink: false },
  },
  {
    required: true,
    field: 'pickOnTemplateData',
    label: '示例',
    component: 'Input',
    slot: 'pickOnTemplateData',
    itemProps: { autoLink: false },
    defaultValue: [],
    ifShow: ({ values }) => {
      return !!values.pickOnTemplateId;
    },
  },
  {
    required: true,
    field: 'waitingPaymentTemplateId',
    label: '待支付订单通知配置',
    component: 'Input',
    slot: 'waitingPaymentTemplateId',
    itemProps: { wrapperCol: { span: 8 }, autoLink: false },
  },
  {
    required: true,
    field: 'waitingPaymentTemplateData',
    label: '示例',
    component: 'Input',
    slot: 'waitingPaymentTemplateData',
    itemProps: { autoLink: false },
    defaultValue: [],
    ifShow: ({ values }) => {
      return !!values.waitingPaymentTemplateId;
    },
  },
];

export const formSchemaModifyBooking: FormSchema[] = [
  {
    field: 'count',
    label: '实际预约人数：',
    component: 'Input',
    defaultValue: '',
    labelWidth: 120,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
  {
    field: 'addCount',
    label: '在实际预约的基础上增加：',
    component: 'Input',
    slot: 'InputCount',
    labelWidth: 190,
  },
  {
    field: 'baseCount',
    label: '展示预约人数：',
    component: 'Input',
    labelWidth: 120,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
];

export const formSchemaModifyJoin: FormSchema[] = [
  {
    field: 'count',
    label: '实际参与人数：',
    component: 'Input',
    defaultValue: '',
    labelWidth: 120,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
  {
    field: 'addCount',
    label: '在实际参与的基础上增加：',
    component: 'Input',
    slot: 'InputCount',
    labelWidth: 190,
  },
  {
    field: 'baseCount',
    label: '展示参与人数：',
    component: 'Input',
    labelWidth: 120,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
];

//详情页搜索表单配置
export const detaillSearchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'isPickOn',
    label: '签码是否中签',
    component: 'Select',
    componentProps: {
      options: awardStatus,
    },
    colProps: { span: 6 },
  },
  {
    field: '[crStartAt, crEndAt]',
    label: '领取签码时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
    colProps: { span: 9 },
  },
];

//详情页表格列配置
export const detailColumns: BasicColumn[] = [
  {
    title: '用户',
    dataIndex: 'operator',
    ellipsis: false,
  },
  {
    title: '签码',
    dataIndex: 'code',
    ellipsis: false,
  },
  {
    title: '领取签码时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
    },
  },
  {
    title: '签码是否中奖',
    dataIndex: 'isPickOn',
    customRender({ text }) {
      return (
        {
          1: '是',
          0: '否',
        }[Number(text)] || '-'
      );
    },
  },
];

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { Popconfirm, Switch } from 'ant-design-vue';
import { h } from 'vue';
import { lotteriesUpdate } from '/@/api/app/lotteries';

export const primaryKey = 'id';
export const pageTitle = '奖池';

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
    width: 50,
  },
  {
    title: '编码',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '奖池名称',
    dataIndex: 'name',
  },
  {
    title: '已发放总数',
    dataIndex: 'sent',
    width: 120,
  },
  {
    title: '活动开始时间',
    dataIndex: 'start',
    customRender: timeRender,
  },
  {
    title: '活动结束时间',
    dataIndex: 'end',
    customRender: timeRender,
  },
  {
    title: '上下架',
    dataIndex: 'disabled',
    customRender: ({ record }: any) => {
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
            const newStatus = !record.disabled;
            return lotteriesUpdate(record.code, { disabled: newStatus } as any)
              .then(() => {
                record.disabled = newStatus;
              })
              .finally(() => (record.pendingStatus = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: !record.disabled,
              checkedChildren: '已上架',
              unCheckedChildren: '已下架',
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
    label: '奖池名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '奖池名称',
    component: 'Input',
  },
  {
    required: true,
    field: 'image',
    label: '奖池头图',
    component: 'ImageUpload',
  },
  {
    field: 'cardImages',
    label: '卡片封面',
    component: 'ImageUploadGroup',
    defaultValue: [],
    componentProps: {
      tip: '图片尺寸建议使用750*X，格式为PNG、JPG、JPEG，大小2M以下，最多可上传9张，可拖拽图片调整显示顺序',
      maxCount: 9,
    },
  },
  {
    required: true,
    field: '[start,end]',
    label: '活动时间',
    component: 'Input',
    slot: 'time',
    defaultValue: [],
  },
  {
    required: true,
    field: 'awards',
    label: '配置奖池',
    component: 'Input',
    slot: 'awards',
    itemProps: {
      autoLink: false,
    },
    defaultValue: [],
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value || !value.length) {
            return Promise.reject('请配置奖池');
          }
          for (const item of value) {
            if (
              item.probability === '' ||
              item.probability === undefined ||
              item.probability === null
            ) {
              return Promise.reject('请填写概率');
            }
            if (item.tips && item.tips.length > 100) {
              return Promise.reject('中奖提示不能超过100个字符');
            }
          }

          const totalProbability = value.reduce((total: number, item: Recordable) => {
            return total + Number(item.probability);
          }, 0);

          if (totalProbability !== 100) {
            return Promise.reject('概率总和必须为100');
          }

          return Promise.resolve();
        },
      },
    ],
  },
  {
    required: false,
    field: 'share-label',
    label: '奖池分享内容',
    component: 'Input',
    slot: 'share-label',
  },
  {
    required: true,
    field: 'shareTitle',
    label: '分享标题',
    component: 'Input',
    componentProps: {
      maxlength: 20,
      showCount: true,
    },
  },
  {
    required: true,
    field: 'shareImage',
    label: '分享图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/jpeg,image/png',
    },
  },
  {
    required: false,
    field: 'dv-label',
    label: '每人抽奖次数限制',
    component: 'Input',
    slot: 'dv-label',
  },
  {
    required: true,
    field: 'limitPerDay',
    label: '每日',
    component: 'InputNumber',
    componentProps: {
      addonAfter: '次',
      min: 0,
    },
  },
  {
    required: true,
    field: 'limitTotal',
    label: '总上限',
    component: 'InputNumber',
    componentProps: {
      addonAfter: '次',
      min: 0,
    },
  },
  {
    required: false,
    field: 'serviceImage',
    label: '联系客服图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/jpeg,image/png',
    },
  },
];

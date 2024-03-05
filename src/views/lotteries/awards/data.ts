import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import ScaleImage from '/@/views/components/ScaleImage.vue';

export const primaryKey = 'id';
export const pageTitle = '奖品';

export enum AwardsType {
  'money' = 'money',
  'coupon' = 'coupon',
  'goods' = 'goods',
  'virtual' = 'virtual',
  'point' = 'point',
  'redpcove' = 'redpcove',
}

export const AwardsTypeList = [
  { label: '现金红包', value: AwardsType.money },
  { label: '实物奖品', value: AwardsType.goods },
  { label: '优惠券', value: AwardsType.coupon },
  { label: '虚拟奖品', value: AwardsType.virtual },
  { label: '积分', value: AwardsType.point },
  { label: '红包封面', value: AwardsType.redpcove },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '奖品名称',
    dataIndex: 'name',
  },
  {
    title: '奖品类型',
    dataIndex: 'type',
    customRender: ({ value }) => {
      const item = AwardsTypeList.find((i) => i.value === value);
      return item?.label;
    },
  },
  {
    title: '缩略图',
    dataIndex: 'image',
    customRender: ({ record }: Recordable) => {
      return h('div', { class: 'flex items-center justify-center' }, [
        h(ScaleImage, { size: 60, src: record.image, mode: 'cover' }),
      ]);
    },
  },
  {
    title: '剩余库存',
    dataIndex: 'stock',
    customRender: ({ record }: Recordable) => record.stock - record.sent,
  },
  {
    title: '已发放数量',
    dataIndex: 'sent',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '奖品名称',
    component: 'Input',
  },
  {
    field: 'type',
    label: '奖品类型',
    component: 'Select',
    componentProps: {
      options: AwardsTypeList,
    },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: false,
    field: 'id',
    label: 'ID',
    component: 'Input',
    slot: 'id',
    show: false,
  },
  {
    required: true,
    field: 'type',
    label: '奖品类型',
    component: 'RadioGroup',
    componentProps: ({ formModel }) => ({
      options: AwardsTypeList,
      onchange: () => {
        formModel.name = '';
        formModel.value = '';
      },
    }),
    defaultValue: AwardsType.money,
    dynamicDisabled: ({ values }) => {
      return values.id !== undefined && values.id != '';
    },
  },
  {
    required: true,
    field: 'name',
    label: '奖品名称',
    component: 'Input',
    componentProps: { maxlength: 10, showCount: true },
  },
  {
    field: 'value',
    label: '红包金额',
    component: 'InputNumber',
    ifShow: ({ values }) => values.type === AwardsType.money,
    componentProps: {
      addonAfter: '元',
      style: {
        width: '150px',
      },
      min: 0,
      max: 99999,
    },
    rules: [
      { required: true, message: '请输入红包金额' },
      {
        trigger: 'blur',
        message: '请输入大于0的数字',
        validator: (_, value) => {
          if (value !== '' && value <= 0) {
            return Promise.reject();
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    required: true,
    field: 'value',
    label: '关联卡券',
    component: 'Input',
    ifShow: ({ values }) => values.type === AwardsType.coupon,
    slot: 'coupon',
    itemProps: {
      autoLink: false,
    },
  },
  {
    required: false,
    field: 'value',
    label: '实物奖品',
    component: 'Input',
    show: false,
    defaultValue: '',
    ifShow: ({ values }) => values.type === AwardsType.goods,
  },
  {
    required: false,
    field: 'value',
    label: '虚拟奖品',
    component: 'Input',
    ifShow: ({ values }) => values.type === AwardsType.virtual,
    show: false,
  },
  {
    required: true,
    field: 'value',
    label: '发放积分数',
    component: 'InputNumber',
    ifShow: ({ values }) => values.type === AwardsType.point,
    componentProps: { style: { width: '150px' }, min: 1, max: 99999, precision: 0 },
    rules: [
      { required: true, message: '请输入发放积分数' },
      {
        message: '请输入大于1的正整数',
        validator: (_, value) => {
          const n = Number(value);
          if (isNaN(n) || n < 0) return Promise.reject();
          return Promise.resolve();
        },
      },
    ],
  },
  {
    required: true,
    field: 'value',
    label: '红包ctoken',
    component: 'Input',
    ifShow: ({ values }) => values.type === AwardsType.redpcove,
    componentProps: { maxLength: 100, showCount: true },
    // rules: [
    //   { required: true, message: '请输入正确的红包ctoken' },
    //   {
    //     trigger: 'blur',
    //     message: '请输入正确的红包ctoken',
    //     validator: (_, value) => {
    //       if (value !== '') return Promise.reject();
    //       return Promise.resolve();
    //     },
    //   },
    // ],
  },
  {
    required: true,
    field: 'image',
    label: '图片',
    component: 'ImageUpload',
    componentProps: { accept: 'image/jpeg,image/jpg,image/png,image/gif' },
  },
  {
    field: 'image2',
    label: '列表展示图片',
    helpMessage: '该图片展示在奖品列表中',
    component: 'ImageUpload',
    componentProps: { accept: 'image/jpeg,image/jpg,image/png,image/gif' },
  },
  {
    field: 'stock',
    label: '库存',
    component: 'InputNumber',
    componentProps: { style: { width: '150px' }, min: 1, max: 99999, precision: 0 },
    dynamicDisabled: ({ values }) => values.id !== undefined && values.id != '',
    rules: [
      {
        required: true,
        trigger: 'blur',
        validator: (_, value) => {
          const n = Number(value);
          if (isNaN(n) || n < 0) return Promise.reject('请输入正确的库存');
          return Promise.resolve();
        },
      },
    ],
  },
  {
    required: false,
    field: 'adjustments',
    label: '增加/减少库存',
    itemProps: { tip: '负数为减少，正数为增加' },
    component: 'InputNumber',
    componentProps: { style: { width: '150px' } },
    ifShow: ({ values }) => values.id !== undefined && values.id != '',
  },
];

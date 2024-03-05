import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { Popconfirm } from 'ant-design-vue';
import ScaleImage from '/@/views/components/ScaleImage.vue';

import { goodsStatusUpdate, catalogsList } from '/@/api/app/goods';
import { EGoodsType } from '/@/api/app/model/goodsModel';
import { isEmpty, isNullOrUnDef } from '/@/utils/is';

import { FormActionType } from '/@/components/Form/index';
import { get } from 'lodash-es';

export interface StepActionType extends FormActionType {
  getDeleteImages: () => number[];
}

export const primaryKey = 'id';

export const goodsTypeOptions = [
  { label: '实物商品', value: EGoodsType.goods },
  { label: '兑换卡', value: EGoodsType.giftCard },
  { label: '优惠券', value: EGoodsType.coupon },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    customRender: ({ record }: Recordable) => {
      return h('div', { class: 'flex items-center text-left' }, [
        h(ScaleImage, { size: 60, src: record.image, mode: 'cover', class: 'mr-2' }),
        h('div', record.name),
      ]);
    },
  },
  {
    title: '价格',
    dataIndex: 'price',
    width: 120,
  },
  {
    title: '实际销量',
    dataIndex: 'sales',
    width: 100,
  },
  {
    title: '剩余库存',
    dataIndex: 'stock',
    width: 100,
  },
  {
    title: '上架状态',
    dataIndex: 'saleStatus',
    width: 100,
    customRender: ({ record }: any) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(
        Popconfirm,
        {
          title: `确定要${record.saleStatus === 1 ? '下架' : '上架'}吗？`,
          onConfirm: () => {
            if (record.pendingStatus) {
              return;
            }
            record.pendingStatus = true;
            const newStatus = record.saleStatus === 1 ? 2 : 1;
            return goodsStatusUpdate(record.id, newStatus)
              .then(() => {
                record.saleStatus = newStatus;
              })
              .finally(() => (record.pendingStatus = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: record.saleStatus === 1,
              checkedChildren: '已上架',
              unCheckedChildren: '已下架',
            }),
        },
      );
    },
  },
  {
    title: '排序(倒序)',
    dataIndex: 'position',
    edit: true,
    width: 200,
  },
  {
    title: '来源',
    width: 100,
    dataIndex: 'source',
    customRender: ({ text }) => ({ admin: '后台', sync: '同步' }[text]),
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '商品名称',
    component: 'Input',
  },
  {
    field: 'sn',
    label: '商品编码',
    component: 'Input',
  },
  {
    field: 'catalogId',
    label: '商品分组',
    component: 'ApiSelect',
    componentProps: {
      api: catalogsList,
      immediate: false,
      resultField: 'list',
      valueField: 'id',
      labelField: 'name',
    },
  },
  {
    field: 'types',
    label: '商品品类',
    component: 'Select',
    componentProps: { options: goodsTypeOptions },
  },
];

// step1 表单配置
export const formSchemaStep1: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '商品名称',
    component: 'Input',
    componentProps: {
      maxlength: 50,
      showCount: true,
    },
  },
  {
    field: 'keywords',
    label: '关键词',
    component: 'Input',
    slot: 'keywords',
  },
  {
    field: 'onSaleAt',
    label: '开售时间',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    required: true,
    field: 'type',
    label: '商品类型',
    component: 'RadioGroup',
    componentProps: { options: goodsTypeOptions },
  },
  {
    field: 'saleMode',
    label: '销售模式',
    component: 'RadioGroup',
    show: ({ values }: Recordable) => values.type == EGoodsType.goods,
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '现货模式', value: 1 },
        // { label: '预售模式', value: 2 },
      ],
    },
  },
  {
    field: 'catalogIds',
    label: '商品分组',
    component: 'Input',
    slot: 'catalog',
    ifShow: ({ values }: Recordable) => values.type == EGoodsType.goods,
  },
  {
    field: 'kind',
    label: '商品品类信息',
    component: 'Input',
    ifShow: false,
  },
  {
    field: 'kindId',
    label: '商品品类',
    component: 'Input',
    slot: 'kindsSlot',
  },
  {
    field: 'properties',
    label: '分组参数设置',
    component: 'Input',
    slot: 'propertiesSlot',
    ifShow: ({ values }: Recordable) =>
      values.type == EGoodsType.goods && values.catalogIds?.length > 0,
  },
  {
    required: true,
    field: 'meta.giftCardId',
    label: '关联兑换卡',
    component: 'Input',
    slot: 'cardSlot',
    ifShow: ({ values }: Recordable) => values.type == EGoodsType.giftCard,
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value) return Promise.reject();
          return Promise.resolve();
        },
        message: '请选择关联兑换卡',
      },
    ],
  },
  {
    required: true,
    field: 'meta.couponCode',
    label: '关联优惠券',
    component: 'Input',
    slot: 'couponSlot',
    ifShow: ({ values }: Recordable) => values.type == EGoodsType.coupon,
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value) return Promise.reject();
          return Promise.resolve();
        },
        message: '请选择关联优惠券',
      },
    ],
  },
  {
    field: 'sn',
    label: '商品编码',
    component: 'Input',
  },
  {
    field: 'barcode',
    label: '条形码',
    component: 'Input',
  },
  {
    required: true,
    field: 'price',
    label: '商品价格',
    component: 'InputNumber',
    componentProps: {
      style: 'width:100%',
      precision: 2,
    },
    suffix: '元',
    itemProps: { wrapperCol: { span: 4 } },
  },
  {
    field: 'guidePrice',
    label: '商品划线价',
    component: 'InputNumber',
    componentProps: {
      style: 'width:100%',
      precision: 2,
    },
    suffix: '元',
    itemProps: { wrapperCol: { span: 4 } },
  },
  {
    field: 'extends.technology',
    label: '工艺',
    component: 'Input',
    componentProps: {
      maxlength: 50,
      showCount: true,
    },
  },
  {
    field: 'extends.releaseDate',
    label: '上市时间',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'weight',
    label: '重量',
    component: 'InputNumber',
    componentProps: {
      style: 'width:100%',
      precision: 2,
    },
    suffix: '千克',
    itemProps: { wrapperCol: { span: 4 } },
  },
  {
    field: 'skus',
    label: '商品规格',
    component: 'Input',
    slot: 'skus',
    ifShow: ({ values }: Recordable) => values.type == EGoodsType.goods,
    itemProps: { autoLink: false },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          console.log(value);
          if (typeof value === 'undefined' || value === null || value.length < 2) {
            return Promise.resolve();
          }
          if (value[0].length > 0) {
            if (value[1].length === 0) {
              return Promise.reject();
            }
            if (
              value[1].some((item: Recordable) => isNullOrUnDef(item.price) || isEmpty(item.price))
            ) {
              return Promise.reject();
            }
          }
          return Promise.resolve();
        },
        message: '请完善商品规格必填项',
      },
    ],
  },
  // {
  //   field: 'stock',
  //   label: '库存数',
  //   component: 'InputNumber',
  //   componentProps: () => {
  //     return {
  //       style: 'width:100%',
  //       disabled: true, // (opts.formModel.skus || []).length > 0,
  //     };
  //   },
  // },
  {
    field: 'buyLimit.enabled',
    label: '是否限购',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '限购', value: true },
        { label: '不限购', value: false },
      ],
    },
  },
  {
    field: 'buyLimit.quantity',
    label: '限购数量',
    component: 'InputNumber',
    componentProps: { min: 0 },
    rules: [
      {
        trigger: 'blur',
        message: '请输入大于等于0的数字',
        validator: (_, value) => {
          if (value === null || value < 0) return Promise.reject();
          return Promise.resolve();
        },
      },
    ],
    ifShow: ({ values }: Recordable) => get(values, 'buyLimit.enabled'),
  },
  {
    required: true,
    field: 'saleStatus',
    label: '上下架',
    component: 'RadioGroup',
    defaultValue: 2,
    componentProps: {
      options: [
        { label: '上架', value: 1 },
        { label: '下架', value: 2 },
      ],
    },
  },
  {
    field: 'openedAt',
    label: '自动上架时间',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'closedAt',
    label: '自动下架时间',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: { format: 'HH:mm:ss' },
    },
  },
  // {
  //   field: 'saleTime',
  //   label: ' ',
  //   component: 'Input',
  //   slot: 'saleTime',
  // },
  {
    required: true,
    field: 'paymentExpiration',
    label: '订单有效期',
    component: 'InputNumber',
    componentProps: {
      style: 'width:100%',
      min: 1,
      max: 1440,
    },
    suffix: '分钟',
    defaultValue: 120,
    itemProps: { wrapperCol: { span: 4 } },
  },
];

// step2 表单配置
export const formSchemaStep2: FormSchema[] = [
  {
    field: 'images',
    label: '商品图片',
    itemProps: { autoLink: false },
    component: 'ImageUploadGroup',
    componentProps: {
      tip: '图片建议尺寸750*750，大小不超过2M，可拖拽图片调整显示顺序',
    },
    required: true,
    rules: [
      {
        required: true,
        message: '请上传商品图片',
        validator: (_, value) =>
          !value || value.length == 0 ? Promise.reject() : Promise.resolve(),
      },
    ],
    slot: 'images',
  },
  {
    field: 'image',
    label: '商品封面图',
    itemProps: { autoLink: false },
    component: 'ImageUpload',
    componentProps: {
      tip: '大小不超过2M，尺寸请按前端展示配置',
      maxCount: 1,
      multiple: false,
    },
  },
  {
    field: 'video',
    label: '主图视频',
    component: 'VideoUpload',
    itemProps: { autoLink: false },
  },
  {
    field: 'videoCover',
    label: '视频封面图',
    itemProps: { autoLink: false },
    component: 'ImageUpload',
    componentProps: {
      tip: '图片建议尺寸750*750，大小不超过2M',
      maxCount: 1,
      multiple: false,
    },
  },
  {
    field: 'shareImageUrl',
    label: '商品分享图',
    itemProps: { autoLink: false },
    component: 'ImageUpload',
    componentProps: {
      tip: '图片建议尺寸750*750，大小不超过2M',
      maxCount: 1,
      multiple: false,
    },
  },
  {
    field: 'extends.aftersales',
    label: '售后须知',
    itemProps: { autoLink: false },
    defaultValue: [],
    component: 'ImageUploadGroup',
    componentProps: {
      tip: '图片建议尺寸750*750，大小不超过2M',
      maxCount: 1,
      multiple: false,
    },
  },
  {
    field: 'details',
    label: '商品详情页',
    component: 'Input',
    slot: 'details',
    itemProps: { autoLink: false },
  },
];

export const formSchemaModifyStatus: FormSchema[] = [
  {
    field: 'itemIds',
    label: '已选商品ID',
    component: 'Input',
    render({ field, model }) {
      const ids = model[field]?.join(',') || '';
      return h('div', ids + `; 共${model[field]?.length || 0}个`);
    },
  },
  {
    field: 'saleStatus',
    label: '设置状态',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '上架', value: 1 },
        { label: '下架', value: 2 },
      ],
    },
  },
];

export const formSchemaModifyCatalog: FormSchema[] = [
  {
    field: 'itemIds',
    label: '已选商品ID',
    component: 'Input',
    render({ field, model }) {
      const ids = model[field]?.join(',') || '';
      return h('div', ids + `; 共${model[field]?.length || 0}个`);
    },
  },
  {
    field: 'catalogIds',
    label: '商品分组',
    component: 'Input',
    slot: 'catalog',
  },
];

export const formSchemaModifyKinds: FormSchema[] = [
  {
    field: 'itemIds',
    label: '已选商品ID',
    component: 'Input',
    render({ field, model }) {
      const ids = model[field]?.join(',') || '';
      return h('div', ids + `; 共${model[field]?.length || 0}个`);
    },
  },
  {
    field: 'kindId',
    label: '商品品类',
    component: 'Input',
    slot: 'kindsSlot',
  },
];

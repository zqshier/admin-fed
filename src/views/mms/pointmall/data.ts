import { Popconfirm, Switch } from 'ant-design-vue';
import dayjs from 'dayjs';
import { h } from 'vue';
import {
  EPointmallTargetType,
  EPointmallType,
  ETagOptionType,
  IPointmallParams,
} from '/@/api/app/model/promotionsModel';
import { pointMallConfigsList, pointMallUpdate as updateApi } from '/@/api/app/promotions';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { TabsOptionItem } from '/@/components/TabsOption';
import { formatToDateTime } from '/@/utils/dateUtil';
import ScaleImage from '/@/views/components/ScaleImage.vue';

export const primaryKey = 'promotionId';
export const pageTitle = '积分商城';

export const goodsTypeList = [
  { label: '实物商品', value: EPointmallTargetType.goods },
  { label: '优惠券', value: EPointmallTargetType.coupon },
];

export const typeList = [
  { label: '积分+现金', value: EPointmallType.pointAndPrice },
  { label: '纯积分', value: EPointmallType.point },
];

export const tabsOptionList: TabsOptionItem[] = [
  { key: 0, tab: '全部' },
  { key: 1, tab: '上架中' },
  { key: 2, tab: '未上架' },
];

export const tabsOptionListParams = [{}, { disable: false }, { disable: true }];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '活动标识',
    dataIndex: 'promotionId',
    width: 100,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    customRender: ({ record }: Recordable) => {
      if (!record?.image) return '';
      return h('div', { class: 'flex items-center text-left' }, [
        h(ScaleImage, { size: 60, src: record.image, mode: 'cover', class: 'mr-2' }),
        h('div', record.name),
      ]);
    },
  },
  {
    title: '商品类型',
    dataIndex: 'targetType',
    customRender: ({ value }) => goodsTypeList.find((item) => item.value == value)?.label,
  },
  {
    title: '商品分组',
    dataIndex: 'group',
  },
  {
    title: '兑换价',
    dataIndex: 'optionData',
    customRender: ({ record }: Recordable) => {
      const result = { point: 0, price: 0 };
      const [data, _] = record?.optionData?.items.sort((a, b) => a.point - b.point);
      result.point = data.point;
      result.price = data.price;
      return `${result.point}积分${result.price > 0 ? `+ ${result.price}元` : ''}`;
    },
  },
  {
    title: '已兑换数',
    dataIndex: 'redeemCount',
    customRender: ({ record }: Recordable) => {
      let redeemCount = 0;
      record?.optionData?.items.forEach((item) => {
        redeemCount += item.redeemCount;
      });
      return redeemCount;
    },
  },
  {
    title: '剩余兑换数',
    dataIndex: 'stock',
    customRender: ({ record }: Recordable) => {
      let remainStock = 0;
      record?.optionData?.items.forEach((item) => {
        remainStock += item.remainStock;
      });
      return remainStock;
    },
  },
  {
    title: '开售时间',
    dataIndex: 'startTime',
    width: 180,
    customRender: ({ record }: Recordable) =>
      `${formatToDateTime(record.startTime)} - ${formatToDateTime(record.endTime)}`,
  },
  {
    title: '上架状态',
    dataIndex: 'disable',
    width: 100,
    customRender: ({ record }: Recordable) => {
      return h(
        Popconfirm,
        {
          title: `确定要${record.disable ? '上架' : '下架'}吗？`,
          onConfirm: () => {
            const newStatus = !record.disable;
            return updateApi(record.promotionId, { disable: newStatus } as IPointmallParams).then(
              () => (record.disable = newStatus),
            );
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: !record.disable,
              checkedChildren: '已上架',
              unCheckedChildren: '已下架',
            }),
        },
      );
    },
  },
  {
    title: '排序',
    dataIndex: 'sort',
    edit: true,
    width: 150,
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
    field: 'targetType',
    label: '商品类型',
    component: 'Select',
    componentProps: { options: goodsTypeList },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'type',
    label: '兑换类型',
    component: 'RadioGroup',
    componentProps: { options: typeList },
  },
  {
    required: true,
    field: 'targetData',
    label: '商品类型',
    component: 'Select',
    componentProps: { options: goodsTypeList },
    slot: 'goodsTypeSlot',
    dynamicRules: ({ model }) => {
      const { type } = model;
      return [
        {
          required: true,
          validator(_, value: Recordable) {
            console.debug('value', value);
            if (!value) return Promise.reject('请完善商品类型数据');
            // 实物商品校验
            if (value?.type === EPointmallTargetType.goods && value?.goodsItems) {
              if (value.goodsItems.length === 0) return Promise.reject('最少选择一个商品');
              for (const item of value.goodsItems) {
                if (item.stock <= 0) return Promise.reject('商品库存不足，请重新选择商品');
                if (item.cstock <= 0) return Promise.reject('可用库存不足，请重新填写');
                if (type === EPointmallType.point && item.cpoint <= 0)
                  return Promise.reject('兑换价积分不可小于等于0');
                if (type === EPointmallType.pointAndPrice) {
                  if (item.cpoint <= 0) return Promise.reject('兑换价积分不可小于等于0');
                  if (item.cprice <= 0) return Promise.reject('兑换价金额不可小于等于0');
                }
              }
            }
            if (value?.type === EPointmallTargetType.coupon && value?.couponItems) {
              if (value.couponItems.length === 0) return Promise.reject('最少选择一张优惠券');
              for (const item of value.couponItems) {
                if (item.stock <= 0) return Promise.reject('优惠券库存不足，请重新选择优惠券');
                if (item.cstock <= 0) return Promise.reject('可用库存不足，请重新填写');
                if (type === EPointmallType.point && item.cpoint <= 0)
                  return Promise.reject('兑换价积分不可小于等于0');
                if (type === EPointmallType.pointAndPrice) {
                  if (item.cpoint <= 0) return Promise.reject('兑换价积分不可小于等于0');
                  if (item.cprice <= 0) return Promise.reject('兑换价金额不可小于等于0');
                }
              }
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
  {
    required: true,
    field: 'group',
    label: '所属分组',
    component: 'ApiSelect',
    componentProps: ({ formActionType }) => {
      return {
        api: pointMallConfigsList,
        mode: 'multiple',
        immediate: false,
        resultField: 'groups',
        valueField: 'name',
        labelField: 'name',
        alwaysLoad: true,
        onChange: () => {
          setTimeout(() => {
            formActionType.validateFields(['group']);
          }, 10);
        },
      };
    },
  },
  {
    required: true,
    field: 'jumpToDetail',
    label: '是否跳转商城',
    component: 'RadioGroup',
    ifShow: ({ values }) => values.targetData?.type === EPointmallTargetType.goods,
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  },
  {
    required: true,
    field: 'displayStartTime',
    label: '开始展示时间',
    component: 'DatePickerEx',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: '[startTime, endTime]',
    label: '开售时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: {
        format: 'HH:mm:ss',
        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      },
      ranges: {
        今天: [dayjs().startOf('day'), dayjs().endOf('day')],
        一周: [dayjs().startOf('w'), dayjs().endOf('w').millisecond(0)],
      },
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          const [startTime, endTime] = value;
          if (!startTime || !endTime) return Promise.reject();
          return Promise.resolve();
        },
        message: '请选择开售时间',
      },
    ],
  },
  {
    required: false,
    field: 'limitCount',
    label: '每人限购数',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 99999,
      addonAfter: '件',
    },
  },
  {
    required: true,
    field: 'expireTime',
    label: '订单有效期',
    component: 'InputNumber',
    componentProps: {
      min: 1,
      max: 1440,
      addonAfter: '分钟',
    },
    defaultValue: 30,
  },
  {
    required: false,
    label: '可购买用户',
    field: 'tagOptions',
    component: 'Input',
    slot: 'groupUser',
    defaultValue: { tagOptionType: ETagOptionType.all, tagOptionData: [] },
  },
];

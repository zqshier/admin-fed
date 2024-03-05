import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { h } from 'vue';
import { Tag, Switch, Popconfirm } from 'ant-design-vue';
import { formatToDateTime } from '/@/utils/dateUtil';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { couponsUpdate as UpdateApi } from '/@/api/app/mms';
import { CouponsListItem } from '/@/api/app/model/mmsModel';

export const primaryKey = 'id';

const noThresholdValue = '2';

export const couponTypeList = [
  { label: '全部', value: '0' },
  { label: '满减券', value: '1' },
  { label: '无门槛', value: noThresholdValue },
  // { label: '折扣券', value: 2 },
];

export const couponStatusList = [
  { label: '全部', value: 0 },
  { label: '进行中', value: 1 },
  { label: '已过期', value: 2 },
];

export const couponConditionList = [
  { label: '全部', value: 0 },
  { label: '全部商品', value: 'all' },
  { label: '适用商品', value: 'include' },
  { label: '排除商品', value: 'exclude' },
];

export const statusOptions = [
  { label: '已使用', value: 'used', color: 'gray' },
  { label: '已作废', value: 'discard', color: 'orange' },
  { label: '未使用', value: 'active', color: 'green' },
];

export const statusSearchOptions = [
  { label: '未使用', value: 1 },
  { label: '已使用', value: 2 },
  { label: '已过期', value: 3 },
];

function timeRender({ text }) {
  if (!text) return '-';
  return formatToDateTime(text);
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '优惠券ID',
    dataIndex: 'id',
  },
  {
    title: '优惠券制成单号',
    dataIndex: 'code',
  },
  {
    title: '优惠券名称',
    dataIndex: 'name',
  },
  {
    width: 90,
    title: '优惠券类型',
    dataIndex: 'type',
    customRender: ({ value }) => couponTypeList.find((item) => item.value == value)?.label,
  },
  {
    width: 90,
    title: '券面值',
    dataIndex: 'value',
    key: 'value',
    // customRender: ({ record }) =>
    //   `满${(record as Recordable)?.threshold} -${(record as Recordable)?.value}`,
  },
  {
    width: 90,
    title: '适用条件',
    dataIndex: 'condition',
    customRender: ({ value }) =>
      couponConditionList.find((item) => item.value == value.type)?.label,
  },
  {
    width: 90,
    title: '总库存数',
    dataIndex: 'stock',
  },
  {
    width: 90,
    title: '总领取数',
    dataIndex: 'sent',
  },
  {
    width: 90,
    title: '总使用数',
    dataIndex: 'used',
  },
  {
    width: 90,
    title: '剩余库存',
    dataIndex: 'remain',
    customRender: (data: Recordable) => data.record.stock - data.record.sent,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    customRender: timeRender,
  },
  {
    title: '优惠券有效期',
    dataIndex: 'expiration',
    customRender: ({ value }) => {
      if (value.start) {
        return timeRender({ text: value.start }) + '至' + timeRender({ text: value.end });
      } else {
        return value.days + '天';
      }
    },
  },
  {
    title: '是否可领取',
    dataIndex: 'userCanGet',
    width: 100,
    customRender: ({ record }: any) => {
      if (!Reflect.has(record, 'userCanGet')) record.userCanGet = false;
      return h(
        Popconfirm,
        {
          title: `确定要设置${record.userCanGet ? '不' : ''}可领取？`,
          onConfirm: () => {
            const newUserCanGet = !record.userCanGet;
            return UpdateApi(record.id, { userCanGet: newUserCanGet } as CouponsListItem)
              .then(() => {
                record.userCanGet = newUserCanGet;
              })
              .catch(() => (record.userCanGet = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: record.userCanGet,
              checkedChildren: '是',
              unCheckedChildren: '否',
            }),
        },
      );
    },
  },
  {
    title: '优惠券状态',
    dataIndex: 'status',
    key: 'status',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '优惠券名称',
    component: 'Input',
  },
  {
    field: 'type',
    label: '优惠券类型',
    component: 'Select',
    componentProps: { options: couponTypeList },
  },
  {
    field: 'state',
    label: '优惠券状态',
    component: 'Select',
    componentProps: { options: couponStatusList },
  },
  {
    field: 'condition',
    label: '适用范围',
    component: 'Select',
    componentProps: { options: couponConditionList },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '优惠券名称',
    component: 'Input',
  },
  {
    field: 'code',
    label: '制成单号',
    component: 'Input',
    componentProps: (opts) => {
      return {
        placeholder: '第三方系统对应单号，不填则自动生成',
        disabled: !!opts.formModel.id,
      };
    },
  },
  {
    required: true,
    field: 'type',
    label: '优惠券类型',
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: { options: couponTypeList.filter((item) => item.value !== '0') },
  },
  {
    required: true,
    field: 'value',
    label: '优惠券面额',
    component: 'InputNumber',
    componentProps: { style: 'width:100%', placeholder: '请输入优惠券面值' },
    suffix: '元',
    itemProps: { wrapperCol: { span: 8 } },
  },
  {
    required: true,
    field: 'threshold',
    label: '使用门槛',
    component: 'InputNumber',
    itemProps: { wrapperCol: { span: 8 } },
    ifShow: ({ values }: Recordable) => !(values.type === noThresholdValue),
    slot: 'threshold',
  },
  {
    required: true,
    field: 'condition',
    label: '适用条件',
    component: 'RadioGroup',
    componentProps: { options: couponConditionList.filter((item) => item.value !== 0) },
    itemProps: {
      autoLink: false,
    },
    slot: 'condition',
  },
  {
    required: true,
    field: 'stock',
    label: '库存',
    component: 'InputNumber',
    componentProps: { style: 'width:100%' },
    itemProps: { wrapperCol: { span: 6 } },
  },
  {
    required: true,
    field: 'expiration',
    label: '生效时间',
    component: 'Input',
    itemProps: { autoLink: false },
    slot: 'expiration',
  },
  {
    required: true,
    field: 'limit',
    label: '领取规则',
    slot: 'limit',
    component: 'Input',
    // component: 'RadioGroup',
    // defaultValue: 0,
    // componentProps: {
    //   options: [
    //     { label: '使用后可领取', value: 2 },
    //     { label: '新客专享', value: 1 },
    //   ],
    // },
  },
  {
    field: 'limitConfig',
    label: '领取限制',
    slot: 'limitConfig',
    component: 'Input',
    itemProps: { autoLink: false },
  },
  {
    field: 'itemId',
    label: '跳转商品',
    component: 'Input',
    componentProps: { placeholder: '请输入商品ID', controls: false, max: 99999999 },
    slot: 'link',
  },
  {
    field: 'rules',
    label: '使用规则',
    component: 'InputTextArea',
    componentProps: { rows: 3 },
  },
];

// 码库表格
export const recordsColumns: BasicColumn[] = [
  {
    title: '优惠券码',
    dataIndex: 'code',
  },
  {
    title: '领取人',
    dataIndex: 'userId',
  },
  {
    title: '领取时间',
    dataIndex: 'createdAt',
    customRender: timeRender,
  },
  {
    title: '领取场景',
    dataIndex: 'memo',
  },
  {
    title: '核销时间',
    dataIndex: 'updatedAt',
    customRender: ({ record }: Recordable) => {
      if (record.status === 'used') {
        return timeRender({ text: record.updatedAt });
      }
      return '-';
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }: Recordable) => {
      const data = statusOptions.find((i) => i.value === record.status);
      let txt = data?.label || '';
      let color = data?.color || 'green';

      if (record.status === 'active' && Date.now() < new Date(record.start).getTime()) {
        txt = '待生效';
      } else if (record.status === 'active' && Date.now() > new Date(record.end).getTime()) {
        txt = '已过期';
        color = 'red';
      }

      return h(Tag, { color }, () => txt);
    },
  },
];

//搜索表单配置
export const recordsSearchForm: FormSchema[] = [
  {
    field: 'userId',
    label: '领取人',
    component: 'Input',
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: { options: statusSearchOptions },
  },
  {
    field: '[createdAtStart,createdAtEnd]',
    label: '领取时间',
    component: 'RangePickerEx',
  },
  {
    field: '[usedStart,usedEnd]',
    label: '核销时间',
    component: 'RangePickerEx',
  },
];

// 优惠券领取列表表格
export const receiveCouponColumns: BasicColumn[] = [
  {
    title: '优惠券名称',
    dataIndex: 'name',
    customRender: ({ record }: Recordable) => record?.config?.name || '',
  },
  {
    title: '优惠券码',
    dataIndex: 'code',
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    customRender: ({ text }: Recordable) => {
      if (!text) return '';
      return h(OperatorInfo, { type: 'user', id: text, showType: true, showId: true, block: true });
    },
  },
  {
    title: '领取时间',
    dataIndex: 'createdAt',
    customRender: timeRender,
  },
  {
    title: '领取场景',
    dataIndex: 'memo',
  },
  {
    title: '核销时间',
    dataIndex: 'updatedAt',
    customRender: ({ record }: Recordable) => {
      if (record.status === 'used') {
        return timeRender({ text: record.updatedAt });
      }
      return '-';
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }: Recordable) => {
      const data = statusOptions.find((i) => i.value === record.status);
      let txt = data?.label || '';
      let color = data?.color || 'green';

      if (record.status === 'active' && Date.now() < new Date(record.start).getTime()) {
        txt = '待生效';
      } else if (record.status === 'active' && Date.now() > new Date(record.end).getTime()) {
        txt = '已过期';
        color = 'red';
      }
      return h(Tag, { color }, () => txt);
    },
  },
];

//搜索优惠券领取列表表单配置
export const receiveCouponSearchForm: FormSchema[] = [
  {
    field: 'couponName',
    label: '优惠券名称',
    component: 'Input',
  },
  {
    field: 'status',
    label: '优惠券状态',
    component: 'Select',
    componentProps: { options: statusSearchOptions },
  },
  {
    field: '[createdAtStart,createdAtEnd]',
    label: '领取时间',
    component: 'RangePickerEx',
  },
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  {
    field: 'code',
    label: '优惠券码',
    component: 'Input',
  },
];

// 添加商品库存
export const formSchemaModifyCouponStock: FormSchema[] = [
  {
    field: 'count',
    label: '剩余优惠券库存数：',
    component: 'Input',
    defaultValue: '',
    labelWidth: 120,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
  {
    field: 'addCount',
    label: '在剩余优惠券库存基础上增加：',
    component: 'Input',
    slot: 'InputCount',
    labelWidth: 190,
  },
  {
    field: 'baseCount',
    label: '增加库存后剩余库存数：',
    component: 'Input',
    labelWidth: 150,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
];

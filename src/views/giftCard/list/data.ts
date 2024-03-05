import { h } from 'vue';
import { InputNumber, Tag } from 'ant-design-vue';
import { GiftCardStates } from '/@/api/app/model/giftCardModel';
import { BasicColumn, FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '卡';

export const cardStatus = [
  { label: '全部', value: '', color: '' },
  { label: '未激活', value: GiftCardStates.unactivated, color: 'default' },
  { label: '已激活', value: GiftCardStates.activated, color: 'green' },
  { label: '已绑定', value: GiftCardStates.bound, color: 'blue' },
  { label: '已过期', value: GiftCardStates.expired, color: 'red' },
  { label: '已用完', value: GiftCardStates.used, color: 'default' },
  { label: '已退款', value: GiftCardStates.refunded, color: 'default' },
  { label: '已注销', value: GiftCardStates.closure, color: 'default' },
  { label: '已冻结', value: GiftCardStates.frozen, color: 'red' },
  { label: '已失效', value: GiftCardStates.invalid, color: 'red' },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 50,
  },
  {
    title: '卡名称',
    dataIndex: 'name',
    ellipsis: false,
  },
  {
    title: '卡面值',
    dataIndex: 'value',
  },
  {
    title: '实际销量',
    dataIndex: 'counter.salesCount',
    customRender: ({ record }: Recordable) => record.counter.salesCount,
  },
  {
    title: '总库存',
    dataIndex: 'counter.totalCount',
    customRender: ({ record }: Recordable) => record.counter.totalCount,
  },
  {
    title: '剩余库存',
    dataIndex: 'stockCount',
    customRender: ({ record }: Recordable) =>
      +record.counter.totalCount - +record.counter.salesCount,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '卡名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '卡名称',
    component: 'Input',
    componentProps: {
      maxlength: 50,
      showCount: true,
    },
  },
  {
    required: true,
    field: 'value',
    label: '卡面值',
    component: 'InputNumber',
    render({ model, field, schema }) {
      const disabled: boolean = (schema?.dynamicDisabled as boolean) || false;
      return h('div', { class: 'flex items-center' }, [
        h(InputNumber, {
          value: model[field],
          min: 0.01,
          max: 99999,
          precision: 2,
          disabled,
          onChange: (value) => (model[field] = value),
        }),
        h('span', { style: { paddingLeft: '10px' } }, '元'),
      ]);
    },
  },
  {
    field: 'expireBeforeBound',
    label: '绑定时间',
    component: 'InputNumber',
    render({ model, field, schema }) {
      const disabled: boolean = (schema?.dynamicDisabled as boolean) || false;
      return h('div', [
        h('div', { class: 'flex items-center' }, [
          h(InputNumber, {
            value: model[field],
            min: 1,
            disabled,
            onChange: (value) => (model[field] = value),
          }),
          h('span', { style: { paddingLeft: '10px' } }, '天'),
        ]),
        h(
          'div',
          { style: { paddingTop: '10px' } },
          '该卡激活后可在X天内绑定，超过绑定期限则无法再次激活',
        ),
      ]);
    },
  },
  {
    required: true,
    field: 'expireAfterBound',
    label: '绑定后有效期',
    component: 'InputNumber',
    render({ model, field, schema }) {
      const disabled: boolean = (schema?.dynamicDisabled as boolean) || false;
      return h('div', [
        h('div', { class: 'flex items-center' }, [
          h(InputNumber, {
            value: model[field],
            min: 1,
            disabled,
            onChange: (value) => (model[field] = value),
          }),
          h('span', { style: { paddingLeft: '10px' } }, '天'),
        ]),
        h(
          'div',
          { style: { paddingTop: '10px' } },
          '该卡绑定后在小程序内X天内有效，超过有效期该兑换卡自动过期，无法使用',
        ),
      ]);
    },
  },
];

// 添加商品库存
export const formSchemaModifyGoodsStock: FormSchema[] = [
  {
    field: 'count',
    label: '剩余商品库存数：',
    component: 'Input',
    defaultValue: '',
    labelWidth: 120,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
  {
    field: 'addCount',
    label: '在剩余商品库存基础上增加：',
    component: 'Input',
    slot: 'InputCount',
    labelWidth: 190,
  },
  {
    field: 'baseCount',
    label: '增加库存后库存数：',
    component: 'Input',
    labelWidth: 130,
    render({ field, model }) {
      return h('span', model[field]);
    },
  },
];

export const detailColumns: BasicColumn[] = [
  {
    title: '卡号',
    dataIndex: 'cardNo',
  },
  {
    title: '卡密',
    dataIndex: 'cardPwd',
    customRender({}: Recordable) {
      return h('span', '**********');
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    customRender({ text }) {
      let state = { label: '', value: '', color: '' };
      for (const states of cardStatus) {
        states.value === text ? (state = states) : '';
      }
      return h(Tag, { color: state.color as GiftCardStates }, () => state?.label || '-');
    },
  },
  {
    title: '购买渠道',
    dataIndex: 'channel',
  },
  {
    title: '备注',
    dataIndex: 'ext',
    key: 'remarkSlot',
  },
];

export const detaillSearchFormSchema: FormSchema[] = [
  {
    field: 'cardNos',
    label: '卡号',
    component: 'Input',
  },
  {
    field: 'states',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: cardStatus,
    },
  },
];

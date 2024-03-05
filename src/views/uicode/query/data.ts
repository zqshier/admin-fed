import { h } from 'vue';
import { formatToDateTime } from '/@/utils/dateUtil';
import { IBatchesType } from '/@/api/app/model/uicodeModel';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { DescItem } from '/@/components/Description/index';
import ScaleImage from '/@/views/components/ScaleImage.vue';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';

export const codeType = [
  { label: '普通商品', value: IBatchesType.normal },
  { label: 'ADT商品', value: IBatchesType.adt },
];

export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'sn',
    label: '请输入13位明码',
    component: 'Input',
    slot: 'searchSlot',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (value.length < 13) return Promise.reject('请输入13位明码');
          return Promise.resolve();
        },
      },
    ],
  },
];

// 详情订单信息
export const codeSchema: DescItem[] = [
  {
    field: 'createdAt',
    label: '生成时间',
    render(val) {
      if (!val) return h('div', '-');
      return h('div', formatToDateTime(val));
    },
  },
  {
    field: 'batch.type',
    label: '二维码类型',
    render(val) {
      let name = '';
      for (const states of codeType) {
        states.value === val ? (name = states.label) : '';
      }
      return name;
    },
  },
  {
    field: 'batch.sn',
    label: '任务名称',
  },
  {
    field: 'productCode',
    label: '是否绑定产品',
    render(val) {
      if (val === undefined) return;
      return Boolean(val) ? '是' : '否';
    },
  },
  {
    field: 'distributor.name',
    label: '经销商名称',
  },
  {
    field: 'productBoundAt',
    label: '绑定商品时间',
    render(val) {
      if (!val) return h('div', '-');
      return h('div', formatToDateTime(val));
    },
  },
  {
    field: 'distributor.code',
    label: '经销商编码',
  },
  {
    field: 'product.name',
    label: '绑定商品名称',
  },
  {
    field: 'wxacode',
    label: '小程序太阳码',
    render(val) {
      if (!val) return '';
      return h('div', { class: 'flex items-center text-left' }, [
        h(ScaleImage, { size: 120, src: val, mode: 'cover', class: 'mr-2' }),
      ]);
    },
  },
  {
    field: 'product.barcode',
    label: '商品69码',
  },
];

export const codesTableSchema: BasicColumn[] = [
  {
    title: '扫码次数',
    dataIndex: 'index',
    customRender: ({ index }) => index + 1,
  },
  {
    title: '扫码时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    width: 100,
    customRender({ value }) {
      if (value) return h(OperatorInfo, { id: value, type: 'user', showType: true, block: true });
      return '';
    },
  },
  {
    title: '用户手机号',
    dataIndex: 'phone',
  },
];

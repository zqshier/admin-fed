import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';

export enum scanAction {
  sn = 'sn',
  productCode = 'productCode',
}

export const formSchema: FormSchema[] = [
  {
    field: 'type',
    label: '扫码操作',
    component: 'RadioGroup',
    slot: 'radioSlot',
    defaultValue: 'sn',
  },
  {
    field: 'value',
    label: ' ',
    component: 'Input',
    slot: 'searchSlot',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (value.length < 13) {
            return Promise.reject('请扫描/输入13位条码');
          }
          return Promise.resolve();
        },
      },
    ],
  },
];

export const stagingTableSchema: BasicColumn[] = [
  {
    title: '经销商',
    dataIndex: 'distributor.name',
    customRender: ({ record }: Recordable) => record.distributor?.name,
  },
  {
    title: '商品69码',
    dataIndex: 'product.barcode',
    customRender: ({ record }: Recordable) => record.product?.barcode,
  },
  {
    title: '商品名称',
    dataIndex: 'product.name',
    customRender: ({ record }: Recordable) => record.product?.name,
  },
  {
    title: '绑定明码数',
    dataIndex: 'childrenNum',
    // customRender: ({ record }: Recordable) => record.rows?.length || 0,
  },
];

export const stagingSnsTableSchema: BasicColumn[] = [
  {
    title: '明码',
    dataIndex: 'sn',
  },
  {
    title: '操作人',
    dataIndex: 'creator',
  },
];

export const comfirmTableSchema: BasicColumn[] = [
  {
    title: '经销商',
    dataIndex: 'distributor.name',
    customRender: ({ record }: Recordable) => record.distributor?.name,
  },
  {
    title: '商品69码',
    dataIndex: 'product.barcode',
    customRender: ({ record }: Recordable) => record.product?.barcode,
  },
  {
    title: '商品名称',
    dataIndex: 'product.name',
    customRender: ({ record }: Recordable) => record.product?.name,
  },
  {
    title: '绑定明码数',
    dataIndex: 'childrenNum',
    // customRender: ({ record }: Recordable) => record.rows?.length || 0,
  },
];

export const comfirmSnsTableSchema: BasicColumn[] = [
  {
    title: '明码',
    dataIndex: 'sn',
  },
  {
    title: '提交时间',
    dataIndex: 'committedAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '操作人',
    dataIndex: 'creator',
  },
];

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '价格';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '商品ID',
    dataIndex: 'item.id',
    customRender: ({ record }: Recordable) => record.item.id,
    width: 120,
  },
  {
    title: '商品名称',
    dataIndex: 'name',
  },
  {
    title: '商品编码',
    dataIndex: 'item.sn',
    customRender: ({ record }: Recordable) => record.item.sn,
    width: 180,
  },
  {
    title: 'skuID',
    dataIndex: 'id',
    width: 180,
  },
  {
    title: 'sku编码',
    dataIndex: 'sn',
    width: 180,
  },
  {
    title: '销售价',
    dataIndex: 'price',
    width: 180,
  },
  {
    title: '划线价',
    dataIndex: 'guidePrice',
    width: 180,
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'itemId',
    label: '商品ID',
    component: 'Input',
  },
  {
    field: 'skuId',
    label: 'skuID',
    component: 'Input',
  },
  {
    field: 'itemName',
    label: '商品名称',
    component: 'Input',
  },
  {
    field: 'itemSn',
    label: '商品编码',
    component: 'Input',
  },
  {
    field: 'sn',
    label: 'sku编码',
    component: 'Input',
  },
  {
    field: '[priceStart,priceEnd]',
    label: '销售价区间',
    component: 'RangeInput',
  },
  {
    field: '[guidePriceStart,guidePriceEnd]',
    label: '划线价区间',
    component: 'RangeInput',
  },
];

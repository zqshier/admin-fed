import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '库存';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '商品名称',
    dataIndex: 'item.name',
    align: 'left',
    width: 500,
  },
  {
    title: '商品编码',
    dataIndex: 'item.sn',
    customRender: ({ record }: Recordable) => record.item.sn,
    width: 100,
  },
  {
    title: '商品ID',
    dataIndex: 'item.id',
    customRender: ({ record }: Recordable) => record.item.id,
    width: 100,
  },
  {
    title: 'sku ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '规格值',
    dataIndex: 'name',
  },
  {
    title: 'sku编码',
    dataIndex: 'sn',
  },
  {
    title: '门店',
    dataIndex: 'storeName',
  },
  {
    title: '实际库存',
    dataIndex: 'stock',
    key: 'stock',
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
    field: 'skuIds',
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
];

import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';

export const primaryKey = 'id';
export const pageTitle = '防伪验真码追溯';

export const pBoundStatus = [
  { label: '全部', value: '', color: '' },
  { label: '是', value: true, color: 'blue' },
  { label: '否', value: false, color: 'red' },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '任务编码',
    dataIndex: 'batch.sn',
    customRender: ({ record }: Recordable) => record.batch?.sn || '',
  },
  {
    title: '明码',
    dataIndex: 'sn',
  },
  {
    title: '生成时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '经销商编码',
    dataIndex: 'distributorCode',
  },
  {
    title: '经销商名称',
    dataIndex: 'distributor.name',
    customRender: ({ record }: Recordable) => record.distributor?.name || '-',
  },
  {
    title: '产品绑定',
    dataIndex: 'productBound',
    customRender({ record }: Recordable) {
      const value = !!record.product || !!record.productBoundAt;
      let state: any = { label: '', value: '', color: '' };
      for (const states of pBoundStatus) {
        if (states.value === value) {
          state = states;
          break;
        }
      }
      return h(Tag, { color: state.color }, () => state?.label || '-');
    },
  },
  {
    title: '绑定时间',
    dataIndex: 'productBoundAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '绑定操作人',
    dataIndex: 'productBoundCreator',
  },
  {
    title: '产品型号',
    dataIndex: 'productCode',
  },
  {
    title: '产品名称',
    dataIndex: 'product.name',
    customRender: ({ record }: Recordable) => record.product?.name || '-',
  },
  {
    title: '产品条型码',
    dataIndex: 'product.barcode',
    customRender: ({ record }: Recordable) => record.product?.barcode || '-',
  },
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'batch.sn',
  //   label: '任务名称',
  //   component: 'Input',
  // },
  {
    field: 'sn',
    label: '明码',
    component: 'Input',
  },
  {
    field: 'productBound',
    label: '是否绑定产品',
    component: 'Select',
    componentProps: { options: pBoundStatus },
  },
  {
    field: '[productBoundAtStart, productBoundAtEnd]',
    label: '绑定时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: '[createdAtStart, createdAtEnd]',
    label: '生成时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'productName',
    label: '产品名称',
    component: 'Input',
  },
  {
    field: 'productBarcode',
    label: '产品69码',
    component: 'Input',
  },
  {
    field: 'distributorName',
    label: '经销商名称',
    component: 'Input',
  },
];

import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDate } from '/@/utils/dateUtil';

export const primaryKey = 'id';
export const pageTitle = 'ADT绑定记录';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '绑定日期',
    dataIndex: 'date',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDate(text);
    },
  },
  {
    title: '绑定产品数',
    dataIndex: 'products',
  },
  {
    title: '绑定明码数',
    dataIndex: 'codes',
  },
  {
    title: '绑定成功数',
    dataIndex: 'committed',
  },
  {
    title: '绑定失败数',
    dataIndex: 'd',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: '[start, end]',
    label: '绑定时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: ['开始时间', '结束时间'],
      valueFormat: 'YYYY-MM-DDT00:00:00Z',
    },
  },
];

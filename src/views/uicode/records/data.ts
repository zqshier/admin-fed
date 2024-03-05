import { h } from 'vue';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDate, formatToDateTime } from '/@/utils/dateUtil';

export const primaryKey = 'id';
export const pageTitle = '扫码记录';

const buyPurposeList = [
  { label: '自用', value: '3' },
  { label: '送礼', value: '1' },
  { label: '收藏', value: '2' },
];

//表格列配置
export const columns: BasicColumn[] = [
  // {
  //   title: '任务名称',
  //   dataIndex: 'name',
  // },
  {
    title: '明码',
    dataIndex: 'sn',
  },
  {
    title: '经销商名称',
    dataIndex: 'distributor.name',
    customRender: ({ record }: Recordable) => record.distributor?.name || '',
  },
  // {
  //   title: '二维码类型',
  //   dataIndex: 'qrcodeType',
  //   customRender({ text }) {
  //     let name = '';
  //     for (const states of codeType) {
  //       states.value === text ? (name = states.label) : '';
  //     }
  //     return name;
  //   },
  // },
  {
    title: '商品编码',
    dataIndex: 'productCode',
  },
  {
    title: '商品名称',
    dataIndex: 'product.name',
    customRender: ({ record }: Recordable) => record.product?.name || '',
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    customRender({ value }) {
      if (value) return h(OperatorInfo, { id: value, type: 'user', showType: false, block: true });
      return '';
    },
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    customRender({ text }) {
      return ['女', '男', '未知'][text];
    },
  },
  {
    title: '会员生日',
    dataIndex: 'birthday',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDate(text);
    },
  },
  {
    title: '购买目的',
    dataIndex: 'buyPurpose',
    customRender: ({ text }) => buyPurposeList.find((i) => i.value == text)?.label,
  },
  {
    title: 'ip地址',
    dataIndex: 'ip',
    customRender: ({ text }) => text || '未知',
  },
  {
    title: 'ip所在省',
    dataIndex: 'province',
    customRender: ({ text }) => text || '未知',
  },
  {
    title: 'ip所在市',
    dataIndex: 'city',
    customRender: ({ text }) => text || '未知',
  },
  {
    title: '扫码时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  {
    field: 'phone',
    label: '用户手机号',
    component: 'Input',
  },
  {
    field: '[scanDateStart, scanDateEnd]',
    label: '扫码时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'productName',
    label: '商品名称',
    component: 'Input',
  },
  {
    field: 'distributorName',
    label: '经销商名称',
    component: 'Input',
  },
];

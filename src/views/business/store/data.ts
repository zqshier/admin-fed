import { h } from 'vue';
import { DescItem } from '/@/components/Description';
import { FormSchema } from '/@/components/Table';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { BasicColumn, TableImg } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '门店汇总';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '店铺ID',
    dataIndex: 'id',
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
    title: '店铺名称',
    dataIndex: 'name',
  },
  {
    title: '用户姓名',
    dataIndex: 'userName',
  },
  {
    title: '用户身份',
    dataIndex: 'userJob',
  },
  {
    title: '扫描有效二维码数',
    dataIndex: 'totalCodes',
    customRender: ({ record }: Recordable) => record?.counter?.totalCodes || 0,
  },
  {
    title: '已发放金额奖励',
    dataIndex: 'totalAmount',
    customRender: ({ record }: Recordable) => record?.counter?.totalAmount || 0,
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  { field: 'userId', label: '用户ID', component: 'Input' },
  { field: 'phone', label: '手机号', component: 'Input' },
  { field: 'address', label: '店铺地址', component: 'Input' },
  // {
  //   field: 'address',
  //   label: '门店地址',
  //   component: 'Input',
  // },
];

// 详情基本信息
export const detailBaseSchema: DescItem[] = [
  {
    field: 'name',
    label: '店铺名称',
  },
  {
    field: 'userJob',
    label: '用户身份',
  },
  {
    field: 'userName',
    label: '用户姓名',
  },
  {
    field: 'userId',
    label: '用户ID',
    render(userId) {
      return h(OperatorInfo, { type: 'user', id: userId, showId: true, block: true });
    },
  },
  { field: 'phone', label: '手机号' },
  {
    field: 'address',
    label: '店铺地址',
    render(_, record) {
      const { province = '', city = '', district = '', address = '' } = record;
      return `${province}${city}${district}${address}`;
    },
  },
  {
    field: 'image',
    label: '门店照片',
    render(val) {
      return h(TableImg, { size: 60, imgList: [val] || [], simpleShow: true });
    },
  },
  {
    field: 'certImage',
    label: '营业执照',
    render(val) {
      return h(TableImg, { size: 60, imgList: [val] || [], simpleShow: true });
    },
  },
  {
    field: 'codes',
    label: '扫描有效二维码数',
    render: (_, record) => record?.counter?.totalCodes || 0,
  },
  {
    field: 'amount',
    label: '已发放总金额奖励',
    render: (_, record) =>
      (record?.counter?.totalAmount && `¥${record?.counter?.totalAmount}`) || 0,
  },
];

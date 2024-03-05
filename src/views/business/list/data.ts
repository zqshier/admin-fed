import { ECnyStoreStatus } from './../../../api/app/model/mmsModel';
import { formatToDateTime } from '/@/utils/dateUtil';
import { h } from 'vue';
import { BasicColumn, TableImg } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { Tag } from 'ant-design-vue';

export const primaryKey = 'id';
export const pageTitle = '门店审核';

export const auditOptions = [
  { label: '全部', value: null, color: '' },
  { label: '审核中', value: ECnyStoreStatus.pending, color: 'default' },
  { label: '审核通过', value: ECnyStoreStatus.approved, color: 'green' },
  { label: '审核拒绝', value: ECnyStoreStatus.disapproved, color: 'red' },
];

const distributionOptions = [
  { label: '全部', value: '' },
  { label: '华西', value: '华西' },
  { label: '河北', value: '河北' },
  { label: '京津鲁', value: '京津鲁' },
  { label: '华东', value: '华东' },
  { label: '华中', value: '华中' },
  { label: '华南', value: '华南' },
  { label: '大北区', value: '大北区' },
  { label: '其他', value: '其他' },
];

const isMoreThan24Options = [
  { label: '全部', value: '' },
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];

//表格列配置
export const columns: BasicColumn[] = [
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
    title: '门店照片',
    dataIndex: 'image',
    customRender({ text }: Recordable) {
      return h(TableImg, { size: 60, imgList: [text] || [], simpleShow: true });
    },
  },
  {
    title: '营业执照',
    dataIndex: 'certImage',
    customRender({ text }: Recordable) {
      return h(TableImg, { size: 60, imgList: [text] || [], simpleShow: true });
    },
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '区域分布',
    dataIndex: 'area',
  },
  {
    title: '所在地区',
    dataIndex: 'province',
    customRender({ record }: Recordable) {
      const { province = '', city = '', district = '' } = record;
      let address = `${province}${city}${district}`;
      if (province === city) address = `${province}${district}`;
      return address;
    },
  },
  {
    title: '店铺地址',
    dataIndex: 'address',
    customRender: ({ record }: Recordable) => record?.address || '',
  },
  {
    title: '提交时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '提交是否超过24小时',
    dataIndex: 'submitOver24Hours',
    customRender({ record }: Recordable) {
      if (!record.createdAt) return '';
      const value = Date.now() - new Date(record.createdAt).getTime() > 24 * 3600 * 1000;
      return isMoreThan24Options.find((i) => i.value === Number(value))?.label;
    },
  },
  {
    title: '审核状态',
    dataIndex: 'status',
    customRender({ value }) {
      if (!value) return '';
      const tag = auditOptions.find((item) => item.value === value);
      return h(Tag, { color: tag?.color }, () => tag?.label);
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID',
    component: 'Input',
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
  },
  {
    field: 'status',
    label: '审核状态',
    component: 'Select',
    componentProps: { options: auditOptions },
  },
  {
    field: 'address',
    label: '店铺地址',
    component: 'Input',
  },
  {
    field: 'submitOver24Hours',
    label: '提交是否超过24小时',
    component: 'Select',
    componentProps: { options: isMoreThan24Options },
  },
  {
    field: 'area',
    label: '区域分布',
    component: 'Select',
    componentProps: { options: distributionOptions },
  },
];

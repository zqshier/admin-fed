import { BasicColumn, TableImg } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import dayjs from 'dayjs';

export const primaryKey = 'id';

export enum GroupUserType {
  all = 'all',
  include = 'includes',
  exclude = 'excludes',
}

export const GroupUserTypeList = [
  { label: '全部用户', value: GroupUserType.all },
  { label: '部分用户可见', value: GroupUserType.include },
  { label: '部分用户不可见', value: GroupUserType.exclude },
];

function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY/MM/DD HH:mm:ss');
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'bannerId',
    dataIndex: 'id',
  },
  {
    title: '描述',
    dataIndex: 'desc',
  },
  {
    title: '小程序展示标题',
    dataIndex: 'title',
  },
  {
    title: '位置',
    dataIndex: 'group',
  },
  {
    title: '展示图',
    dataIndex: 'src',
    customRender({ text, record }: Recordable) {
      if (record.srcType === 'video') {
        text += '?x-oss-process=video/snapshot,t_100,f_jpg,w_0,h_0,m_fast';
      }
      return h(TableImg, {
        size: 60,
        imgList: [text],
      });
    },
  },
  {
    title: '展示时间',
    dataIndex: 'start',
    customRender: timeRender,
  },
  {
    title: '结束时间',
    dataIndex: 'end',
    customRender: timeRender,
  },
  {
    title: '最近时间',
    dataIndex: 'updatedAt',
    customRender: timeRender,
  },
  {
    title: '排序(倒序)',
    dataIndex: 'position',
    edit: true,
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: 'Banner名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'group',
    label: '位置',
    component: 'Input',
    componentProps: {
      placeholder: '请输入Banner位置',
    },
  },
  {
    required: true,
    field: 'desc',
    label: '描述',
    component: 'Input',
    componentProps: {
      placeholder: '请输入Banner描述',
    },
  },
  {
    field: 'title',
    label: '小程序展示标题',
    component: 'Input',
    componentProps: {
      placeholder: '请输入小程序展示标题',
    },
  },
  {
    required: true,
    field: 'src',
    label: '展示图',
    component: 'FileUpload',
    rules: [{ required: true, message: '请上传展示图' }],
  },
  {
    required: true,
    field: 'linkType',
    label: '跳转类型',
    component: 'RadioGroup',
    defaultValue: 'none',
    componentProps: {
      options: [
        { label: '不跳转', value: 'none' },
        { label: '小程序路径', value: 'path' },
        { label: '外部H5', value: 'h5' },
        { label: '外部小程序', value: 'weapp' },
      ],
    },
  },
  {
    required: true,
    field: 'mpAppId',
    label: 'APPID',
    component: 'Input',
    ifShow: ({ values }) => values.linkType === 'weapp',
  },
  {
    required: true,
    field: 'link',
    label: '跳转路径',
    component: 'Input',
    ifShow: ({ values }) => values.linkType !== 'none',
  },
  {
    required: false,
    field: '[start,end]',
    label: '展示时间',
    component: 'Input',
    slot: 'time',
  },
  {
    required: false,
    label: '可见用户',
    field: 'config',
    component: 'Input',
    slot: 'config',
    defaultValue: { type: GroupUserType.all, tagIds: [] },
    itemProps: {
      autoLink: false,
    },
  },
];

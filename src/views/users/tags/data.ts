import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

export const primaryKey = 'id';
export const pageTitle = '用户标签';

function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY/MM/DD HH:mm:ss');
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '标签ID',
    dataIndex: 'id',
  },
  {
    title: '标签名称',
    dataIndex: 'name',
  },
  {
    title: '标签定义',
    dataIndex: 'desc',
  },
  {
    title: '标签人数',
    dataIndex: 'num',
  },
  {
    title: '最近更新时间',
    dataIndex: 'updatedAt',
    customRender: timeRender,
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '标签名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '标签名称',
    component: 'Input',
  },
  {
    required: true,
    field: 'topicInfo',
    label: '标签类型',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [{ label: '手动标签', value: 1 }],
    },
  },
];

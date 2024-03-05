import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

export const primaryKey = 'id';
export const pageTitle = 'tab模块';

function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY/MM/DD HH:mm:ss');
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '模块名称',
    dataIndex: 'name',
  },
  {
    title: '编号',
    dataIndex: 'code',
  },
  {
    title: '开始时间',
    dataIndex: 'start',
    customRender: timeRender,
  },
  {
    title: '结束时间',
    dataIndex: 'end',
    customRender: timeRender,
  },
  {
    title: '最近修改时间',
    dataIndex: 'updatedAt',
    customRender: timeRender,
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '模块名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '模块名称',
    component: 'Input',
  },
  {
    required: true,
    field: '[start,end]',
    label: '展示时间',
    component: 'Input',
    slot: 'time',
  },
  {
    required: true,
    field: 'code',
    label: '编号',
    component: 'Input',
    itemProps: {
      tip: '小程序端约定编号, 新增后不能修改',
    },
    componentProps: {
      placeholder: '请输入小程序对应编号',
    },
  },
  {
    required: true,
    field: 'topicInfo',
    label: 'tab组',
    component: 'Input',
    slot: 'topic',
    itemProps: {
      autoLink: false,
    },
  },
];

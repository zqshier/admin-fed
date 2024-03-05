import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

export const primaryKey = 'id';
export const pageTitle = 'tab组';

function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY/MM/DD HH:mm:ss');
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '组名称',
    dataIndex: 'name',
  },
  {
    title: 'tab数',
    dataIndex: 'tags',
    customRender: ({ value }) => value.length,
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
    label: '组名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '组名称',
    component: 'Input',
  },
  {
    required: true,
    field: 'tags',
    label: 'tab配置',
    component: 'Input',
    slot: 'tags',
    defaultValue: [],
    itemProps: {
      autoLink: false,
    },
  },
];

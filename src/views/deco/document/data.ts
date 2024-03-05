import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';

export const primaryKey = 'id';

function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY/MM/DD HH:mm:ss');
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '标识码',
    dataIndex: 'code',
  },
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    customRender: timeRender,
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
    field: 'title',
    label: '标题',
    component: 'Input',
  },
  {
    required: true,
    field: 'code',
    label: '标识编码',
    component: 'Input',
  },
  {
    field: 'editor',
    label: '内容',
    slot: 'editor',
    component: 'Input',
    itemProps: { autoLink: false },
  },
];

import { BasicColumn, FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '商品品类';

//表格列配置
export const columns: BasicColumn[] = [
  { title: '品类名称', dataIndex: 'name', ellipsis: true },
  { title: '品类ID', dataIndex: 'id' },
  { title: '品类编号', dataIndex: 'code' },
  { title: '商品数量', dataIndex: 'itemsTotal' },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '品类名称',
    component: 'Input',
    componentProps: { maxlength: 30, showCount: true },
  },
  {
    field: 'code',
    label: '品类编号',
    component: 'Input',
    componentProps: { maxlength: 30, showCount: true },
  },
];

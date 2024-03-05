import { BasicColumn, FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '经销商';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '经销商名称',
    dataIndex: 'name',
  },
  {
    title: '经销商编码',
    dataIndex: 'code',
  },
  {
    title: '省份',
    dataIndex: 'province',
  },
  {
    title: '城市',
    dataIndex: 'city',
  },
  {
    title: '电话',
    dataIndex: 'phoneNumber',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '经销商名称',
    component: 'Input',
  },
  {
    field: 'code',
    label: '经销商编码',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '经销商名称',
    component: 'Input',
    componentProps: { maxlength: 20, showCount: true },
  },
  {
    required: true,
    field: 'code',
    label: '经销商编码',
    component: 'Input',
    componentProps: { maxlength: 3, showCount: true },
  },
  {
    field: 'province',
    label: '省份',
    component: 'Input',
    componentProps: { maxlength: 20, showCount: true },
  },
  {
    field: 'city',
    label: '城市',
    component: 'Input',
    componentProps: { maxlength: 20, showCount: true },
  },
  {
    field: 'phoneNumber',
    label: '电话',
    component: 'Input',
    componentProps: { maxlength: 20, showCount: true },
  },
];

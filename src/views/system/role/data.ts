import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const primaryKey = 'roleName';
export const pageTitle = '角色';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '角色描述',
    dataIndex: 'remark',
  },
  {
    title: '成员数量',
    dataIndex: 'usersNum',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '角色名称',
    defaultValue: '',
    component: 'Input',
  },
  {
    required: false,
    field: 'remark',
    label: '角色描述',
    defaultValue: '',
    component: 'InputTextArea',
  },
];

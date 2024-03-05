import { BasicColumn, TableImg } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';

export const primaryKey = 'id';
export const pageTitle = '菜单';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '展示名称',
    dataIndex: 'title',
  },
  {
    title: '路由名称',
    dataIndex: 'routerName',
  },
  {
    title: '路由路径',
    dataIndex: 'perm',
  },
  {
    title: '是否显示',
    dataIndex: 'hide',
    customRender({ value }) {
      return value === 0 ? '显示' : '隐藏';
    },
  },
  {
    title: '父ID',
    dataIndex: 'parentId',
  },
  {
    title: '文件路径',
    dataIndex: 'file',
  },
  {
    title: '展示图标',
    dataIndex: 'icon',
    customRender({ value }) {
      return h(TableImg, { size: 40, imgList: [value] });
    },
  },
  {
    title: '排序',
    dataIndex: 'order',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '展示名称',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'routerName',
    label: '路由名称',
    component: 'Input',
  },
  {
    required: true,
    field: 'perm',
    label: '路由路径',
    component: 'Input',
  },
  {
    required: true,
    field: 'title',
    label: '展示名称',
    component: 'Input',
  },
  {
    field: 'hide',
    label: '是否显示',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '是', value: 0 },
        { label: '否', value: 1 },
      ],
    },
  },
  {
    required: true,
    field: 'file',
    label: '文件路径',
    component: 'Input',
  },
  {
    field: 'parentId',
    label: '父ID',
    component: 'Input',
  },
  {
    field: 'icon',
    label: '展示图标',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/jpeg,image/png',
      sizeTips: '40*40',
    },
  },
  {
    required: true,
    field: 'order',
    label: '排序',
    component: 'Input',
  },
];

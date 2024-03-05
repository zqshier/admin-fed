import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';
import { listRoles } from '/@/api/sys/role';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '成员';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '账号',
    dataIndex: 'identifier',
    customRender: ({ record }) => {
      const a = (record as any).auths?.find((a) => a.identityType === 'pwd');
      return a && a.identifier;
    },
  },
  {
    title: '成员姓名',
    dataIndex: 'nickname',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '角色',
    dataIndex: 'roles',
    customRender: ({ record }) => (record as any).roles[0].name,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    customRender: ({ record }) => dayjs((record as any).createdAt).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '状态',
    dataIndex: 'disabled',
    customRender: ({ text }: Recordable) => {
      const disabled = !!text;
      return h(Tag, { color: disabled ? 'error' : 'success' }, () => (disabled ? '停用' : '有效'));
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '成员姓名',
    component: 'Input',
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
  },
  {
    field: 'role',
    label: '角色',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'username',
    label: '账号',
    component: 'Input',
  },
  {
    required: true,
    field: 'password',
    label: '密码',
    component: 'Input',
    helpMessage: ['大写、小写、数字、特殊字符、长度大于等于12，最少符合4条'],
  },
  {
    required: false,
    field: 'info.phone',
    label: '手机号',
    component: 'Input',
  },
  {
    required: false,
    field: 'info.nickname',
    label: '成员姓名',
    component: 'Input',
  },
  {
    required: true,
    field: 'role',
    label: '当前角色',
    component: 'ApiSelect',
    componentProps: {
      api: listRoles,
      immediate: true,
      resultField: 'list',
      valueField: 'roleName',
      labelField: 'name',
    },
    itemProps: {
      autoLink: false,
    },
  },
  // {
  //   required: false,
  //   field: 'remark',
  //   label: '备注信息',
  //   component: 'InputTextArea',
  // },
];

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { format } from 'date-fns';
import { Popconfirm } from 'ant-design-vue';

import { guidesUpdate, storesListApi } from '/@/api/app/stores';

export const primaryKey = 'id';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '导购名称',
    dataIndex: 'name',
  },
  {
    title: '导购ID',
    dataIndex: 'wxId',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '所属门店',
    dataIndex: 'store',
    customRender({ value }) {
      return value?.name;
    },
  },
  {
    title: '职位',
    dataIndex: 'position',
  },
  {
    title: '指定发货导购',
    dataIndex: 'shipper',
    customRender({ value }) {
      return !!value ? '是' : '否';
    },
  },
  {
    title: '专属导购',
    dataIndex: 'global',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy/MM/dd HH:mm:ss');
    },
  },
  {
    title: '导购状态',
    dataIndex: 'status',
    customRender: ({ record }: any) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(
        Popconfirm,
        {
          title: `确定要${record.status === 1 ? '禁用' : '启用'}吗？`,
          onConfirm: () => {
            if (record.pendingStatus) {
              return;
            }
            record.pendingStatus = true;
            const newStatus = record.status === 1 ? 0 : 1;
            return guidesUpdate(record.id, { status: newStatus } as any)
              .then(() => {
                record.status = newStatus;
              })
              .finally(() => (record.pendingStatus = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: record.status === 1,
              checkedChildren: '已启用',
              unCheckedChildren: '已禁用',
            }),
        },
      );
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '导购名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'wxId',
    label: '导购ID',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'storeCode',
    label: '所属门店',
    component: 'ApiSelect',
    componentProps: {
      api: storesListApi,
      immediate: false,
      resultField: 'list',
      valueField: 'code',
      labelField: 'name',
    },
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '导购状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'shipper',
    label: '是否指定发货导购',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '导购名称',
    component: 'Input',
  },
  {
    field: 'avatar',
    label: '导购头像',
    component: 'ImageUpload',
    rules: [{ required: true, message: '请上传导购头像' }],
  },
  {
    field: 'qrcode',
    label: '导购二维码',
    component: 'ImageUpload',
    rules: [{ required: true, message: '请上传导购二维码' }],
  },
  {
    required: true,
    field: 'wxId',
    label: '导购企微ID',
    component: 'Input',
    componentProps: {
      placeholder: '请输入导购的企业微信ID',
    },
  },
  {
    required: true,
    field: 'code',
    label: '导购编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入导购编号',
    },
  },
  {
    required: true,
    field: 'phone',
    label: '手机号',
    component: 'Input',
  },
  {
    required: true,
    field: 'storeCode',
    label: '所属门店',
    component: 'ApiSelect',
    componentProps: {
      api: storesListApi,
      immediate: false,
      resultField: 'list',
      valueField: 'code',
      labelField: 'name',
    },
    itemProps: {
      autoLink: false,
    },
  },
  {
    required: true,
    field: 'position',
    label: '职位',
    component: 'Select',
    componentProps: {
      options: [
        { label: '店长', value: '店长' },
        { label: '店员', value: '店员' },
      ],
    },
  },
  {
    required: true,
    field: 'status',
    label: '导购状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
  {
    field: 'shipper',
    label: '指定发货导购',
    component: 'Checkbox',
    componentProps: {
      defaultChecked: false,
    },
    renderComponentContent: '启用为指定发货导购',
  },
];

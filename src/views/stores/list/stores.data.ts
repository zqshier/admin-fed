import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { format } from 'date-fns';
import { Popconfirm } from 'ant-design-vue';

import { storesUpdate } from '/@/api/app/stores';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '门店名称',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '门店代码',
    dataIndex: 'code',
    width: 100,
  },
  {
    title: '门店类型',
    dataIndex: 'type',
  },
  {
    title: '门店位置',
    dataIndex: 'address',
  },
  {
    title: '导购数量',
    dataIndex: 'numOfGuides',
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
    title: '门店状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }: { record }) => {
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
            return storesUpdate(record.code, { status: newStatus } as any)
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
    label: '门店名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'code',
    label: '门店代码',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'type',
    label: '门店类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '直营', value: '直营' },
        { label: '加盟', value: '加盟' },
      ],
    },
    colProps: { span: 4 },
  },
  {
    field: 'status',
    label: '门店状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
    colProps: { span: 4 },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '门店名称',
    component: 'Input',
  },
  {
    required: true,
    field: 'code',
    label: '门店代码',
    component: 'Input',
  },
  {
    required: true,
    field: 'type',
    label: '门店类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '直营', value: '直营' },
        { label: '加盟', value: '加盟' },
      ],
    },
  },
  {
    required: true,
    field: 'status',
    label: '门店状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
  {
    required: true,
    field: 'district',
    label: '门店地址',
    component: 'Select',
    slot: 'district',
  },
  {
    required: true,
    field: 'address',
    label: '详细地址',
    component: 'Input',
    dynamicRules: ({ values }) => {
      if (!!values.address && !!values.district) {
        formSchema.find(({ field }) => field === 'longitude')!.ifShow = true;
        formSchema.find(({ field }) => field === 'latitude')!.ifShow = true;
        formSchema.find(({ field }) => field === 'loca')!.ifShow = true;
      } else {
        formSchema.find(({ field }) => field === 'longitude')!.ifShow = false;
        formSchema.find(({ field }) => field === 'latitude')!.ifShow = false;
        formSchema.find(({ field }) => field === 'loca')!.ifShow = false;
      }
      return [{ required: true }];
    },
  },
  {
    required: true,
    field: 'longitude',
    label: '经度',
    component: 'Input',
    colProps: { span: 10 },
    componentProps: {
      type: 'number',
    },
  },
  {
    required: true,
    field: 'latitude',
    label: '纬度',
    component: 'Input',
    colProps: { span: 10 },
    componentProps: {
      type: 'number',
    },
  },
  /** 定位按钮 */
  {
    field: 'loca',
    label: ' ',
    component: 'Input',
    slot: 'loca',
    colProps: { span: 4 },
    labelWidth: 40,
  },
  /** 地图 */
  {
    field: 'map',
    label: ' ',
    component: 'Input',
    slot: 'map',
    ifShow: false,
  },
  {
    field: 'phone',
    label: '门店电话',
    component: 'Input',
  },
  {
    field: 'opentime',
    label: '营业时间',
    component: 'Input',
  },
  {
    field: 'logo',
    label: '门店图片',
    component: 'Input',
    slot: 'upload',
  },
];

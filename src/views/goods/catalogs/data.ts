import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { Popconfirm } from 'ant-design-vue';

import { catalogsUpdate } from '/@/api/app/goods';

export const primaryKey = 'id';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '分组名称',
    dataIndex: 'name',
    align: 'left',
    key: 'name',
  },
  {
    title: '分组ID',
    dataIndex: 'id',
    align: 'left',
  },
  {
    title: '商品数量',
    dataIndex: 'num',
    align: 'left',
    customRender({ text }) {
      return `商品数量：${text}`;
    },
  },
  {
    title: '是否显示分组',
    dataIndex: 'hidden',
    align: 'left',
    customRender: ({ record }: Recordable) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(
        Popconfirm,
        {
          title: `确定要${record.hidden ? '显示分组' : '隐藏'}吗？`,
          onConfirm: () => {
            if (record.pendingStatus) {
              return;
            }
            record.pendingStatus = true;
            const newStatus = record.hidden ? false : true;
            return catalogsUpdate(record.id, { hidden: newStatus } as any)
              .then(() => {
                record.hidden = Number(newStatus);
              })
              .catch(() => (record.pendingStatus = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: !record.hidden,
              checkedChildren: '已显示分组',
              unCheckedChildren: '已隐藏分组',
            }),
        },
      );
    },
  },
  {
    title: '排序',
    dataIndex: 'position',
    align: 'left',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'parentName',
    label: '所属分组',
    component: 'Input',
    ifShow: ({ values }: Recordable) => !!values.parentName,
    dynamicDisabled: true,
  },
  {
    required: true,
    field: 'name',
    label: '分组名称',
    component: 'Input',
  },
  {
    field: 'displayName',
    label: '显示名称',
    component: 'Input',
    ifShow: false,
  },
  {
    field: 'image',
    label: '分组banner',
    component: 'ImageUpload',
  },
  {
    required: true,
    field: 'hidden',
    label: '分组状态',
    component: 'RadioGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '显示', value: 0 },
        { label: '隐藏', value: 1 },
      ],
    },
  },
];

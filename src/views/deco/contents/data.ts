import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import ScaleImage from '../../components/ScaleImage.vue';
import { h } from 'vue';
import { Popconfirm, Switch, Tag } from 'ant-design-vue';
import { contentsSave } from '/@/api/app/deco';

export const primaryKey = 'id';
export const pageTitle = '内容';
export const documentCode = 'daily';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '内容名称',
    dataIndex: 'title',
  },
  {
    title: '内容展示',
    dataIndex: 'type',
    customRender({ record }: Recordable) {
      if (record.type === 'text') {
        return typeof record.content === 'object' ? record.content.v : record.content;
      } else if (record.type === 'image') {
        return h('div', { class: 'flex justify-center' }, [
          h(ScaleImage, {
            mode: 'scale-down',
            size: 150,
            src: typeof record.content === 'object' ? record.content.v : record.content,
          }),
        ]);
      }
    },
  },
  {
    title: '编号',
    dataIndex: 'code',
  },
  {
    title: '指定配置',
    dataIndex: 'meta',
    customRender({ value }) {
      const txt = Object.keys(value).length > 0 ? '指定' : '未指定';
      return h(Tag, { color: txt === '指定' ? 'green' : 'gray' }, () => txt);
    },
  },
  {
    title: '上下架',
    dataIndex: 'disabled',
    width: 120,
    customRender: ({ record }: Recordable) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      return h(
        Popconfirm,
        {
          title: `确定要${record.disabled ? '上架' : '下架'}吗？`,
          onConfirm: () => {
            if (record.pendingStatus) {
              return;
            }
            record.pendingStatus = true;
            return contentsSave(documentCode, { id: record.id, disabled: !record.disabled } as any)
              .then((res) => {
                record.disabled = res.disabled;
              })
              .finally(() => (record.pendingStatus = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: !record.disabled,
              checkedChildren: '上架',
              unCheckedChildren: '下架',
            }),
        },
      );
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '内容名称',
    component: 'Input',
  },
  {
    field: 'meta',
    label: '指定配置',
    component: 'Select',
    componentProps: {
      options: [
        { label: '指定', value: 1 },
        { label: '未指定', value: 0 },
      ],
    },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'title',
    label: '内容名称',
    component: 'Input',
  },
  {
    required: true,
    field: '[type,content]',
    label: '内容展示',
    component: 'Input',
    slot: 'content',
    itemProps: {
      autoLink: false,
    },
  },
  {
    required: true,
    field: 'code',
    label: '编号',
    component: 'Input',
  },
  {
    field: '[flag,meta]',
    label: '是否指定日期',
    component: 'Input',
    slot: 'meta',
    itemProps: {
      autoLink: false,
    },
  },
];

import { h } from 'vue';
import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '分组参数';

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '所属分组',
    // align: 'left',
    dataIndex: 'catalogs',
    customRender: ({ text }) => {
      const catalogs: string[] = [];
      for (const item of text) {
        catalogs.push(
          (item.pathNames.join('-') && `${item.pathNames.join('-')} -> ${item.name}`) || item.name,
        );
      }
      return h(
        'span',
        { style: { 'white-space': 'pre-line', display: 'inline-block', 'text-align': 'left' } },
        catalogs.join('\n').trim(),
      );
    },
  },
  {
    title: '参数名称',
    dataIndex: 'name',
  },
  {
    title: '参数值',
    dataIndex: 'values',
    customRender: ({ text }) => (text.join() && text.join(', ')) || '',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '参数名称',
    component: 'Input',
  },
];

export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '参数名称',
    component: 'Input',
    componentProps: { maxlength: 10, showCount: true },
  },
  {
    required: true,
    field: 'catalogIds',
    label: '商品分组',
    component: 'Input',
    slot: 'catalogSlot',
  },
  {
    required: true,
    field: 'values',
    label: '参数值',
    component: 'Input',
    slot: 'valueSlot',
    rules: [
      {
        required: true,
        trigger: 'blur',
        validator: (_, value) => {
          if (value.length === 0) return Promise.reject();

          for (const val of value) {
            if (!val.name) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请输入参数值',
      },
    ],
  },
];

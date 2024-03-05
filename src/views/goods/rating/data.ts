import dayjs from 'dayjs';
import { h } from 'vue';
import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { Popconfirm, Switch } from 'ant-design-vue';
import { RatingParams, ratingUpdate } from '/@/api/app/goods';

export const primaryKey = 'id';
export const pageTitle = '评分';

export function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '评分名称',
    dataIndex: 'title',
  },
  {
    title: '评分标签',
    // align: 'left',
    dataIndex: 'tags',
    customRender: ({ text }) => {
      return h('span', text.join('、'));
    },
  },
  {
    title: '关联商品',
    dataIndex: 'relevanceItems',
    customRender: ({ text }) => {
      return h('span', text.length);
    },
  },
  {
    title: '上下架',
    dataIndex: 'disabled',
    width: 150,
    customRender: ({ record }: any) => {
      return h(
        Popconfirm,
        {
          title: `确定要${!!!record.disabled ? '下架' : '上架'}吗？`,
          onConfirm: () => {
            const disabled = !!!record.disabled;
            return ratingUpdate(record.id, { disabled } as RatingParams)
              .then(() => {
                record.disabled = disabled;
              })
              .catch(() => (record.disabled = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: !record.disabled,
              checkedChildren: '已上架',
              unCheckedChildren: '已下架',
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
    label: '评分名称',
    component: 'Input',
  },
];

export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'title',
    label: '评分名称',
    component: 'Input',
    componentProps: { maxlength: 10, showCount: true },
  },
  {
    required: true,
    field: 'tags',
    label: '评分标签',
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
        message: '请输入评分标签',
      },
    ],
  },
  {
    required: true,
    field: 'itemIds',
    label: '关联商品',
    component: 'Input',
    slot: 'GoodsSlot',
    rules: [
      {
        required: true,
        trigger: 'blur',
        validator: (_, value) => {
          if (value.length === 0) return Promise.reject();
          return Promise.resolve();
        },
        message: '请选择关联商品',
      },
    ],
  },
];

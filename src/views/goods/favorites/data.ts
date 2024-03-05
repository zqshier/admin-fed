import dayjs from 'dayjs';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';

export const primaryKey = 'id';
export const pageTitle = '商品收藏';

export function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
}

export const FavoritedStatusOptions = [
  { label: '已取消', value: false, color: 'gray' },
  { label: '收藏中', value: true, color: 'green' },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    width: 100,
    customRender({ value }) {
      if (value)
        return h(OperatorInfo, {
          id: value,
          type: 'user',
          showType: false,
          block: true,
          field: 'id',
        });
      return '';
    },
  },
  {
    title: '商品名称',
    dataIndex: 'goodsname',
    customRender({ record }: Recordable) {
      if (record.target) {
        return (record.target.item && record.target.item.name) || '';
      }
      return '';
    },
  },
  {
    title: '规格名称',
    dataIndex: 'goodssku',
    customRender({ record }: Recordable) {
      if (record.target) {
        const combs = record.target.comb.map(
          (item) => `${item.k && item.v ? `${item.k}-${item.v}` : ''}`,
        );
        return combs.join('、').trim();
      }
      return '';
    },
  },
  {
    title: '商品编号',
    dataIndex: 'goodssn',
    customRender({ record }: Recordable) {
      if (record.target) {
        return (record.target.sn && record.target.sn) || '';
      }
      return '';
    },
  },
  // {
  //   title: '最近收藏时间',
  //   dataIndex: 'createdAt',
  //   customRender({ record }: Recordable) {
  //     return timeRender({ text: record.updatedAt });
  //   },
  // },
  // {
  //   title: '最近取消收藏时间',
  //   dataIndex: 'updatedAt',
  //   customRender: timeRender,
  // },
  {
    title: '最后更新时间',
    dataIndex: 'updatedAt',
    customRender: timeRender,
  },
  {
    title: '收藏状态',
    dataIndex: 'favorited',
    customRender({ value }: Recordable) {
      const tag = FavoritedStatusOptions.find((item) => item.value === value);
      return h(Tag, { color: tag?.color }, () => tag?.label);
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '商品名称',
    component: 'Input',
  },
  {
    field: 'sn',
    label: '商品编码',
    component: 'Input',
  },
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  // {
  //   field: '[favoriteStart, favoriteEnd]',
  //   label: '最近收藏时间',
  //   component: 'RangePicker',
  //   componentProps: {
  //     format: 'YYYY-MM-DD HH:mm:ss',
  //     placeholder: ['开始时间', '结束时间'],
  //     showTime: { format: 'HH:mm:ss' },
  //   },
  // },
  {
    field: 'favorited',
    label: '收藏状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '已取消', value: false },
        { label: '收藏中', value: true },
      ],
    },
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
  },
];

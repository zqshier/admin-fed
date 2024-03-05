import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import ScaleImage from '/@/views/components/ScaleImage.vue';

export const primaryKey = 'id';

const showInPageOptions = [
  { label: '全部', value: -1 },
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];

//表格列配置
export const columns: BasicColumn[] = [
  { title: '商品ID', dataIndex: 'itemId' },
  {
    title: '商品名称',
    dataIndex: 'name',
    customRender: ({ record }: Recordable) => {
      return h('div', { class: 'flex items-center text-left' }, [
        h(ScaleImage, { size: 60, src: record.image, mode: 'cover', class: 'mr-2' }),
        h('div', record.name),
      ]);
    },
  },
  { title: '商品详情已关联商品数量', dataIndex: 'relationItemsNum' },
  {
    title: '此商品是否展示在搜索页',
    dataIndex: 'isShow',
    customRender: ({ value }: Recordable) => (value ? '是' : '否'),
  },
  {
    title: '小程序搜索页排序',
    dataIndex: 'sort',
    edit: true,
    editComponent: 'InputNumber',
    editComponentProps: { controls: false, precision: 0 },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  { field: 'itemIds', label: '商品ID', component: 'Input' },
  { field: 'name', label: '商品名称', component: 'Input' },
  {
    field: 'isShow',
    label: '此商品是否展示在搜索页',
    labelWidth: 200,
    component: 'Select',
    componentProps: { options: showInPageOptions },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'relationItems',
    label: '商品详情关联商品',
    slot: 'corGoodsConfig',
    component: 'Input',
  },
  {
    required: true,
    field: 'isShow',
    label: '搜索页是否展示',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  },
];

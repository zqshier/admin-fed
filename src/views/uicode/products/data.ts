import { h } from 'vue';
import { formatToDateTime } from '/@/utils/dateUtil';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '产品主数据';

export const productStatus = [
  { label: '未用', value: '0', color: 'blue' },
  { label: '激活', value: '1', color: 'green' },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '产品型号',
    dataIndex: 'code',
  },
  {
    title: '产品69码',
    dataIndex: 'barcode',
  },
  {
    title: '英文名称',
    dataIndex: 'name_e',
    ellipsis: true,
  },
  {
    title: '中文名称',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '建议零售价',
    dataIndex: 'price',
  },
  {
    title: '产品状态',
    dataIndex: 'status',
    customRender({ text }) {
      let state: any = { label: '', value: '', color: '' };
      for (const states of productStatus) {
        states.value === text ? (state = states) : '';
      }
      return h(Tag, { color: state.color }, () => state?.label || '-');
    },
  },
  {
    title: '申请类别',
    dataIndex: 'applyType',
  },
  {
    title: '产品类别',
    dataIndex: 'type1',
  },
  {
    title: '是否在售',
    dataIndex: 'onSale',
  },
  {
    title: '是否基础款',
    dataIndex: 'isBaseModel',
  },
  {
    title: '创建人',
    dataIndex: 'creator',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '修改时间',
    dataIndex: 'updatedAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'code',
    label: '产品型号',
    component: 'Input',
  },
  {
    field: 'barcode',
    label: '产品条形码',
    component: 'Input',
  },
  {
    field: 'name',
    label: '中文名称',
    component: 'Input',
  },
  {
    field: 'status',
    label: '产品状态',
    component: 'Select',
    componentProps: {
      options: productStatus,
    },
  },
  {
    field: 'applyType',
    label: '申请类型',
    component: 'Input',
  },
  {
    field: 'type1',
    label: '产品类别',
    component: 'Input',
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    colProps: { span: 24 },
    componentProps: { disabled: true },
    ifShow: ({ values }) => {
      return !!values.id;
    },
  },
  {
    required: true,
    field: 'code',
    label: '产品型号',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'barcode',
    label: '产品69码',
    component: 'Input',
    componentProps: { maxlength: 13, showCount: true },
  },
  {
    required: true,
    field: 'name_e',
    label: '英文名称',
    component: 'Input',
    componentProps: { maxlength: 100, showCount: true },
    rules: [
      {
        required: true,
        validator: (_, value: string) => {
          if (!new RegExp('^[A-Za-z ]*$').test(value.trim()))
            return Promise.reject('请输入英文名称');
          return Promise.resolve();
        },
      },
    ],
  },
  {
    required: true,
    field: 'name',
    label: '中文名称',
    component: 'Input',
    componentProps: { maxlength: 100, showCount: true },
  },
  {
    field: 'price',
    label: '建议零售价',
    component: 'InputNumber',
    componentProps: { min: 1, max: 99999, step: 1 },
  },
  {
    required: true,
    field: 'status',
    label: '产品状态',
    component: 'Select',
    componentProps: { options: productStatus },
  },
  {
    field: 'baseModel',
    label: '基座型号',
    component: 'Input',
    componentProps: { maxlength: 64, showCount: true },
  },
  {
    field: 'applyType',
    label: '申请类型',
    component: 'Input',
    componentProps: { maxlength: 64, showCount: true },
  },
  {
    field: 'type1',
    label: '产品类别',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'source',
    label: '产品来源',
    component: 'Input',
    componentProps: { maxlength: 64, showCount: true },
  },
  {
    field: 'type2',
    label: '产品层级1',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'type3',
    label: '产品层级2',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'type4',
    label: '产品层级3',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'surface',
    label: '表面工艺',
    component: 'Input',
    componentProps: { maxlength: 64, showCount: true },
  },
  {
    field: 'decoration',
    label: '装饰工艺',
    component: 'Input',
    componentProps: { maxlength: 64, showCount: true },
  },
  {
    field: 'lifeCycle',
    label: '产品生命周期',
    component: 'Input',
    componentProps: { maxlength: 64, showCount: true },
  },
  {
    field: 'place',
    label: '产地',
    component: 'Input',
    componentProps: { maxlength: 64, showCount: true },
  },
  {
    field: 'launchDate',
    label: '上市日期',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'launchYear',
    label: '上市年度',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'launchMonth',
    label: '上市月度',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'channel',
    label: '销售渠道',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'onSale',
    label: '是否在售',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'isBaseModel',
    label: '是否基础款',
    component: 'Input',
    componentProps: { maxlength: 32, showCount: true },
  },
  {
    field: 'qrPhoto',
    label: '产品图片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/jpeg,image/png',
      sizeTips: '750*750',
      maxCount: 1,
      multiple: false,
    },
  },
  {
    field: 'photos',
    label: 'DRP照片',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/jpeg,image/png',
      sizeTips: '750*750',
      maxCount: 1,
      multiple: false,
    },
  },
  // {
  //   field: 'baseModel',
  //   label: '创建人',
  //   component: 'Input',
  //   componentProps: { maxlength: 100, showCount: true, disabled: true },
  //   ifShow: ({ values }) => {
  //     return !!values.id;
  //   },
  // },
  // {
  //   field: 'baseModel2',
  //   label: '记录创建时间',
  //   component: 'Input',
  //   componentProps: { maxlength: 100, showCount: true, disabled: true },
  //   ifShow: ({ values }) => {
  //     return !!values.id;
  //   },
  // },
  // {
  //   field: 'baseModel3',
  //   label: '记录更新人',
  //   component: 'Input',
  //   componentProps: { maxlength: 100, showCount: true, disabled: true },
  //   ifShow: ({ values }) => {
  //     return !!values.id;
  //   },
  // },
  // {
  //   field: 'baseModel4',
  //   label: '记录更新时间',
  //   component: 'Input',
  //   componentProps: { maxlength: 100, showCount: true, disabled: true },
  //   ifShow: ({ values }) => {
  //     return !!values.id;
  //   },
  // },
];

import { Popconfirm, Switch } from 'ant-design-vue';
import dayjs from 'dayjs';
import { h } from 'vue';
import { EBookingTarget } from './../../../api/app/model/bookingModel';
import { bookingUpdate as updateApi } from '/@/api/app/booking';
import { BasicColumn, FormSchema } from '/@/components/Table';
import ScaleImage from '/@/views/components/ScaleImage.vue';

export const primaryKey = 'id';
export const pageTitle = '预约';

function timeRender({ text }) {
  if (!text) return '-';
  return dayjs(text).format('YYYY/MM/DD HH:mm:ss');
}

export interface TemplateOptionsModel {
  label: string;
  value: string;
  content: string;
  example: string;
}

const tagetOptions = [
  { label: '普通商品', value: EBookingTarget.goods },
  { label: '积分商品', value: EBookingTarget.pointmall },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '预约对象标识',
    dataIndex: 'targetId',
    width: 120,
  },
  {
    title: '预约对象类型',
    dataIndex: 'target',
    customRender: ({ text }: Recordable) => tagetOptions.find((i) => i.value === text)?.label,
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    customRender: ({ record }: Recordable) => {
      const goods = record.goods;
      if (!goods || !goods.name) {
        return '';
      }
      return h('div', { class: 'flex items-center text-left' }, [
        h(ScaleImage, { size: 60, src: goods.image, mode: 'cover', class: 'mr-2' }),
        h('div', goods.name),
      ]);
    },
    width: 300,
  },
  {
    title: '商品编码',
    dataIndex: 'goodsSn',
    customRender: ({ record }: Recordable) => {
      return record.goods?.sn || '';
    },
  },
  {
    title: '活动名称',
    dataIndex: 'name',
  },
  {
    title: '开始预约时间',
    dataIndex: 'start',
    customRender: timeRender,
  },
  {
    title: '活动通知发送时间',
    dataIndex: 'sendAt',
    customRender: timeRender,
  },
  {
    title: '实际预约人数',
    dataIndex: 'bookedNumbers',
    width: 150,
  },
  {
    title: '展示预约人数',
    dataIndex: 'bookedBaseNumbers',
    width: 150,
  },
  {
    title: '上下架',
    dataIndex: 'hidden',
    width: 100,
    fixed: 'right',
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
            return updateApi(record.id, { disabled: !record.disabled } as any)
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
export const searchFormSchema: FormSchema[] = [];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'name',
    label: '活动名称',
    component: 'Input',
  },
  {
    required: true,
    field: 'start',
    label: '开始预约时间',
    component: 'DatePickerEx',
  },
  {
    required: true,
    field: 'sendAt',
    label: '通知发送时间',
    component: 'DatePickerEx',
  },
  // {
  //   required: true,
  //   field: 'target',
  //   label: '预约商品类型',
  //   component: 'RadioGroup',
  //   componentProps: {
  //     options: [
  //       { label: '普通商品', value: EBookingTarget.goods },
  //       { label: '积分商品', value: EBookingTarget.pointmall },
  //     ],
  //   },
  // },
  {
    field: 'targetData',
    label: '预约商品',
    component: 'Input',
    componentProps: { options: tagetOptions },
    slot: 'goods',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          const { targetId = '' } = value;
          if (!targetId) return Promise.reject();
          return Promise.resolve();
        },
        message: '请选择预约商品',
      },
    ],
  },
  {
    required: true,
    field: 'templateId',
    label: '通知模版ID',
    component: 'Input',
    slot: 'templateId',
    itemProps: { wrapperCol: { span: 8 }, autoLink: false },
  },
  {
    required: true,
    field: 'templateData',
    label: '示例',
    component: 'Input',
    slot: 'templateData',
    itemProps: { autoLink: false },
    defaultValue: [],
    ifShow: ({ values }) => {
      return !!values.templateId;
    },
  },
];

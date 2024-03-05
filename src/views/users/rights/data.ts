import { Popconfirm, Switch } from 'ant-design-vue';
import dayjs from 'dayjs';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { userRightsSave } from '/@/api/app/users';
import ScaleImage from '/@/views/components/ScaleImage.vue';

export const primaryKey = 'code';
export const pageTitle = '会员权益';

export enum GroupUserType {
  'all' = 'all',
  'include' = 'include',
  'exclude' = 'exclude',
}

export const GroupUserTypeList = [
  { label: '全部用户', value: GroupUserType.all },
  { label: '部分用户可参与', value: GroupUserType.include },
  { label: '部分用户不可参与', value: GroupUserType.exclude },
];

enum ERemindType {
  once = 'once',
  daily = 'daily',
}

export function timeRender(text: string) {
  if (!text) return '-';
  return dayjs(text).format('YYYY.MM.DD HH:mm:ss');
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '权益名称',
    dataIndex: 'name',
  },
  {
    title: '权益图标',
    dataIndex: 'image',
    width: 120,
    customRender: ({ value }: Recordable) =>
      h(ScaleImage, { src: value, size: 60, align: 'center' }),
  },
  {
    title: '权益说明',
    dataIndex: 'desc',
  },
  {
    title: '权益分类',
    dataIndex: 'catalog',
  },
  {
    title: '上架时间',
    dataIndex: 'times',
    customRender: ({ record }: Recordable) => {
      if (!record?.displayStartAt || !record?.displayStartAt) return '';
      return `${timeRender(record.displayStartAt)} - ${timeRender(record.displayEndAt)}`;
    },
  },
  {
    title: '权益开启',
    dataIndex: 'enabled',
    width: 120,
    customRender: ({ record }: Recordable) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }
      const statusKey = 'enabled';
      const checked = { value: true, label: '开启' };
      const unchecked = { value: false, label: '关闭' };
      return h(
        Popconfirm,
        {
          title: `确定要${
            record[statusKey] === checked.value ? unchecked.label : checked.label
          }吗？`,
          onConfirm: () => {
            if (record.pendingStatus) {
              return;
            }
            record.pendingStatus = true;
            return userRightsSave({
              [primaryKey]: record[primaryKey],
              [statusKey]: record[statusKey] === checked.value ? unchecked.value : checked.value,
            } as any)
              .then((res) => {
                record[statusKey] = res[statusKey];
              })
              .finally(() => (record.pendingStatus = false));
          },
        },
        {
          default: () =>
            h(Switch, {
              checked: record[statusKey] === checked.value,
              checkedChildren: checked.label,
              unCheckedChildren: unchecked.label,
            }),
        },
      );
    },
  },
  {
    title: '排序',
    dataIndex: 'position',
    width: 120,
    edit: true,
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'name',
  //   label: '活动名称',
  //   component: 'Input',
  // },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'code',
    label: 'code',
    component: 'Input',
    show: false,
  },
  {
    required: true,
    field: 'name',
    label: '权益名称',
    component: 'Input',
    componentProps: { maxlength: 20, showCount: true },
  },
  {
    required: true,
    field: 'catalog',
    label: '权益分类',
    component: 'Input',
    componentProps: { maxlength: 20, showCount: true },
  },
  {
    required: true,
    field: 'image',
    label: '权益图标',
    component: 'ImageUpload',
    itemProps: {
      autoLink: false,
    },
  },
  {
    required: true,
    field: 'desc',
    label: '权益说明',
    component: 'InputTextArea',
    componentProps: { maxlength: 99, showCount: true },
  },
  {
    required: true,
    field: '[displayStartAt,displayEndAt]',
    label: '上架时间',
    component: 'RangePickerEx',
  },
  {
    required: true,
    field: 'buttonText',
    label: '展示按钮',
    component: 'Input',
    componentProps: { maxlength: 9, showCount: true },
  },
  {
    required: false,
    field: 'path',
    label: '跳转路径',
    component: 'Input',
  },
  {
    field: 'remind',
    label: '点击提醒',
    component: 'RadioGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '不开启', value: false },
        { label: '开启', value: true },
      ],
    },
  },
  {
    required: true,
    field: 'remindAt',
    label: '提醒时间',
    component: 'RangePickerEx',
    defaultValue: [],
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
    ifShow: ({ model }) => !!model.remind,
  },
  {
    field: 'remindType',
    label: '提醒类型',
    component: 'RadioGroup',
    defaultValue: ERemindType.once,
    componentProps: {
      options: [
        { label: '只亮一次', value: ERemindType.once },
        { label: '每日一次', value: ERemindType.daily },
      ],
    },
    ifShow: ({ model }) => !!model.remind,
  },
];

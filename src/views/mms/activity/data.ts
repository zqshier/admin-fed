import { h } from 'vue';
import { formatToDateTime } from '/@/utils/dateUtil';
import { Tag } from 'ant-design-vue';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { isArray } from '/@/utils/is';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { EActiviyState } from '/@/api/app/model/activityModel';

export const primaryKey = 'id';
export const pageTitle = '活动';

export const activityStatusOptions = [
  { label: '未开始', value: EActiviyState.notStarted, color: 'gray' },
  { label: '进行中', value: EActiviyState.processing, color: 'green' },
  { label: '已结束', value: EActiviyState.finished, color: 'red' },
];

export function timeRender(time: string) {
  if (!time) return '-';
  return formatToDateTime(time);
}

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '活动标题',
    dataIndex: 'title',
  },
  {
    title: '报名时间',
    dataIndex: 'start',
    customRender: ({ record }: Recordable) => {
      return `${timeRender(record.start)} - ${timeRender(record.end)}`;
    },
  },
  {
    title: '报名人数',
    dataIndex: 'sign_up_num',
  },
  {
    title: '活动状态',
    dataIndex: 'state',
    customRender({ value }: Recordable) {
      const tag = activityStatusOptions.find((item) => item.value === value);
      return (tag && h(Tag, { color: tag?.color }, () => tag?.label)) || '';
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '活动标题',
    component: 'Input',
  },
  {
    field: 'state',
    label: '活动状态',
    component: 'Select',
    componentProps: { options: activityStatusOptions },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    required: true,
    field: 'title',
    label: '活动标题',
    component: 'Input',
    componentProps: { maxlength: 50, showCount: true },
  },
  {
    required: true,
    field: '[start,end]',
    label: '报名时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!isArray(value) || value.length <= 0) return Promise.reject();
          for (const v of value) {
            if (!v) return Promise.reject();
          }
          return Promise.resolve();
        },
        message: '请填写完整报名时间',
      },
    ],
  },
  {
    required: true,
    field: 'image',
    label: '活动封面图',
    component: 'ImageUpload',
    componentProps: { accept: 'image/jpeg,image/png,image/gif' },
  },
  {
    required: true,
    field: 'mainImage',
    label: '活动详情主图',
    component: 'ImageUploadGroup',
    componentProps: {
      tip: '图片大小不超过2M，只能是JPG、PNG、GIF格式，可拖拽图片调整显示顺序',
      maxCount: 9,
    },
  },
  {
    field: 'detailImage',
    label: '活动详情',
    component: 'ImageUploadGroup',
    componentProps: {
      tip: '图片大小不超过2M，只能是JPG、PNG、GIF格式，可拖拽图片调整显示顺序',
      maxCount: 9,
    },
  },
  {
    field: 'shareImage',
    label: '活动分享图',
    component: 'ImageUpload',
    componentProps: { accept: 'image/jpeg,image/png,image/gif' },
  },
];

export const recordColumns: BasicColumn[] = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    customRender({ value }) {
      if (!value) return '';
      return h(OperatorInfo, {
        id: value,
        type: 'user',
        showType: false,
        block: true,
        showId: true,
      });
    },
  },
  {
    title: '手机号',
    dataIndex: 'phone',
  },
  {
    title: '报名时间',
    dataIndex: 'createdAt',
    customRender: ({ text }: Recordable) => timeRender(text),
  },
  {
    title: '活动标题',
    dataIndex: 'activity.title',
    customRender: ({ record }: Recordable) => (record?.activity && record.activity.title) || '',
  },
];

//搜索表单配置
export const recordSearchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  {
    field: 'title',
    label: '活动标题',
    component: 'Input',
  },
  {
    field: '[startTime,endTime]',
    label: '报名时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
];

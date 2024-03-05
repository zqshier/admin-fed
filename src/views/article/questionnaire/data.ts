import { EQuestionnaireState } from './../../../api/app/model/articleModel';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { formatToDateTime } from '/@/utils/dateUtil';
import { BasicColumn, FormSchema } from '/@/components/Table';

export const primaryKey = 'id';
export const pageTitle = '调查问卷';

export const questionnaireStatus = [
  { label: '全部', value: -1 },
  { label: '未开始', value: EQuestionnaireState.notStarted, color: 'gray' },
  { label: '进行中', value: EQuestionnaireState.processing, color: 'green' },
  { label: '已结束', value: EQuestionnaireState.finished, color: 'red' },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '问卷备注',
    dataIndex: 'title',
  },
  {
    title: '问卷时间',
    dataIndex: 'start',
    customRender: ({ record }: Recordable) =>
      `${formatToDateTime(record.start)} - ${formatToDateTime(record.end)}`,
  },
  {
    title: '完成问答人数',
    dataIndex: 'answer_num',
  },
  {
    title: '问卷状态',
    dataIndex: 'state',
    customRender: ({ value }) => {
      const tag = questionnaireStatus.find((item) => item.value === value);
      return (tag && h(Tag, { color: tag?.color }, () => tag?.label)) || '';
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'title',
    label: '问卷备注',
    component: 'Input',
  },
  {
    field: 'state',
    label: '状态',
    component: 'Select',
    componentProps: { options: questionnaireStatus },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'title',
    label: '问卷备注',
    component: 'Input',
    componentProps: { maxlength: 20, showCount: true },
  },
  {
    required: true,
    field: '[start, end]',
    label: '问卷时间',
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
          const [start, end] = value;
          if (!start || !end) return Promise.reject();
          return Promise.resolve();
        },
        message: '请选择问卷时间',
      },
    ],
  },
  {
    field: 'questions',
    label: '问卷内容',
    component: 'Input',
    slot: 'contentSlot',
    rules: [
      {
        required: true,
        validator(_, value: Recordable[]) {
          if (!value.length) return Promise.reject('请填写问卷内容');
          // for (const item of value) {
          //   if (!item?.title) return Promise.reject('请输入题目标题');
          //   if (!item?.option && !item.option?.length) return Promise.reject('请填写题目选项');
          // }
          return Promise.resolve();
        },
      },
    ],
  },
];

export const recordColumns: BasicColumn[] = [
  {
    title: '用户ID',
    dataIndex: 'userId',
  },
  {
    title: '提交问卷时间',
    dataIndex: 'createdAt',
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
    field: '[startAt,endAt]',
    label: '提交问卷时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
];

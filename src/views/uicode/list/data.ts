import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { ETaskStep, EBatchStep, ETaskType } from '/@/api/app/model/uicodeModel';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { IBatchesType } from '/@/api/app/model/uicodeModel';
import { formatToDateTime } from '/@/utils/dateUtil';

export const primaryKey = 'id';
export const pageTitle = '任务列表';

export const codeStatus = [
  { label: '全部', value: null, color: '' },
  { label: '未启动', value: EBatchStep.pending, color: 'default' },
  { label: '进行中', value: EBatchStep.processing, color: 'blue' },
  { label: '已完成', value: EBatchStep.completed, color: 'green' },
];

export const detailCodeStatus = [
  { label: '待处理', value: ETaskStep.pending, color: 'default' },
  { label: '生成编码记录', value: ETaskStep.genCode, color: 'blue' },
  { label: '待生成太阳码', value: ETaskStep.waitGenImg, color: 'blue' },
  { label: '待打包', value: ETaskStep.waitZip, color: 'blue' },
  { label: '待出库', value: ETaskStep.waitPublish, color: 'blue' },
  { label: '已完成', value: ETaskStep.completed, color: 'green' },
];

export const codeType = [
  { label: '普通商品', value: IBatchesType.normal },
  { label: 'ADT商品', value: IBatchesType.adt },
];

export const tasksTypeOptions = [
  { label: '火机', value: ETaskType.lighter },
  { label: '户外产品', value: ETaskType.outdoorGoods },
  { label: '油', value: ETaskType.oil },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '任务编码',
    dataIndex: 'sn',
  },
  {
    title: '任务备注',
    dataIndex: 'memo',
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
    title: '经销商数量',
    dataIndex: 'distributorNum',
  },
  {
    title: '二维码类型',
    dataIndex: 'type',
    customRender({ text }) {
      let name = '';
      for (const states of codeType) {
        states.value === text ? (name = states.label) : '';
      }
      return name;
    },
  },
  {
    title: '二维码总数',
    dataIndex: 'codeNum',
  },
  {
    title: '任务状态',
    dataIndex: 'step',
    customRender({ text }) {
      let state: any = { label: '', value: '', color: '' };
      for (const states of codeStatus) {
        states.value === text ? (state = states) : '';
      }
      return h(Tag, { color: state.color }, () => state?.label || '-');
    },
  },
  {
    title: '任务开始时间',
    dataIndex: 'startTime',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '任务结束时间',
    dataIndex: 'finishTime',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'memo',
    label: '任务备注',
    component: 'Input',
  },
  {
    field: '[createdAtStart, createdAtEnd]',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'step',
    label: '任务状态',
    component: 'Select',
    componentProps: {
      options: codeStatus,
    },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'memo',
    label: '任务备注',
    component: 'Input',
    componentProps: { maxlength: 20, showCount: true },
  },
  {
    required: true,
    field: 'type',
    label: '二维码类型',
    component: 'Select',
    componentProps: { options: codeType },
  },
  {
    required: true,
    label: '经销商信息',
    field: 'distributors',
    component: 'Input',
    slot: 'distributorsSlot',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (typeof value === 'undefined' || value === null || value.length <= 0) {
            return Promise.reject('请填写经销商信息');
          }
          for (const item of value) {
            if (item.num <= 0) return Promise.reject('请填写经销商二维码生成数量');
          }
          return Promise.resolve();
        },
      },
    ],
  },
];

//详情页搜索表单配置
export const detaillSearchFormSchema: FormSchema[] = [
  {
    field: 'distributorName',
    label: '经销商名称',
    component: 'Input',
  },
  {
    field: 'step',
    label: '任务状态',
    component: 'Select',
    componentProps: {
      options: detailCodeStatus,
    },
  },
];

export const detailColumns: BasicColumn[] = [
  {
    title: '任务编码',
    dataIndex: 'sn',
  },
  {
    title: '经销商名称',
    dataIndex: 'distributor.name',
    customRender: ({ record }: Recordable) => record.distributor?.name || '',
  },
  {
    title: '经销商编码',
    dataIndex: 'distributor.code',
    customRender: ({ record }: Recordable) => record.distributor?.code || '',
  },
  {
    title: '二维码类型',
    dataIndex: 'qrcodeType',
    customRender({ text }) {
      let name = '';
      for (const states of codeType) {
        states.value === text ? (name = states.label) : '';
      }
      return name;
    },
  },
  {
    title: '产品类型',
    dataIndex: 'type',
    customRender: ({ text }) => tasksTypeOptions.find((i) => i.value === text)?.label || '',
  },
  {
    title: '二维码数量',
    dataIndex: 'codeNum',
  },
  {
    title: '起始编码',
    dataIndex: 'start',
    customRender: ({ record }: Recordable) =>
      record.step === ETaskStep.pending ? '' : record.start,
  },
  {
    title: '结束编码',
    dataIndex: 'end',
    customRender: ({ record }: Recordable) => (record.step === ETaskStep.pending ? '' : record.end),
  },
  {
    title: '任务状态',
    dataIndex: 'step',
    customRender({ text }) {
      let state: any = { label: '', value: '', color: '' };
      for (const states of detailCodeStatus) {
        states.value === text ? (state = states) : '';
      }
      return h(Tag, { color: state.color }, () => state?.label || '-');
    },
  },
];

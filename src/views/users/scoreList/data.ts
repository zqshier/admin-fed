import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { EUserPointsStatus, EUserPointsType } from '/@/api/app/model/userModel';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';

export const primaryKey = 'id';
export const pageTitle = '积分明细';

const statusText = {
  [EUserPointsStatus.pending]: '待确认',
  [EUserPointsStatus.commited]: '已入账',
  [EUserPointsStatus.refund]: '已退款',
  [EUserPointsStatus.rolledback]: '已取消',
};

const statusColor = {
  [EUserPointsStatus.pending]: 'orange',
  [EUserPointsStatus.commited]: 'green',
  [EUserPointsStatus.rolledback]: 'default',
  [EUserPointsStatus.refund]: 'red',
};

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    customRender({ value }) {
      if (!value) return '';
      return h(OperatorInfo, { id: value, type: 'user', showId: true, block: true });
    },
  },
  {
    title: '变更时间',
    dataIndex: 'createdAt',
    customRender: ({ value }: Recordable) => {
      if (!value) return '-';
      return formatToDateTime(value);
    },
  },
  {
    title: '变动前余额',
    dataIndex: 'balance',
  },
  {
    title: '变动积分',
    dataIndex: 'changed',
    customRender({ record, value }: Recordable) {
      if (!value) return '';
      const unit =
        record.type === EUserPointsType.credit || record.type === EUserPointsType.debref
          ? '+'
          : '-';
      const color = unit === '+' ? 'green' : 'red';
      const val = `${unit}${value}`;
      if (
        record.status === EUserPointsStatus.rolledback ||
        record.status === EUserPointsStatus.refund
      ) {
        return h('del', {}, val);
      }
      return h('strong', { style: { color } }, val);
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender({ value }) {
      return h(Tag, { color: statusColor[value] }, () => statusText[value]);
    },
  },
  {
    title: '来源',
    dataIndex: 'channel',
  },
  {
    title: '备注',
    dataIndex: 'memo',
  },
  {
    title: '过期时间',
    dataIndex: 'expiredAt',
    customRender: ({ value }: Recordable) => {
      if (!value) return '-';
      return formatToDateTime(value);
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
    // componentProps: { placeholder: '请输入用户id或手机号' },
  },
  {
    field: '[startDate,endDate]',
    label: '变更时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'channel',
    label: '来源',
    component: 'Input',
  },
];

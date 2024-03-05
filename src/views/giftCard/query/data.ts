import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { format } from 'date-fns';
import { cardStatus } from '../list/data';
import { GiftCardStates } from '/@/api/app/model/giftCardModel';
import { BasicColumn, FormSchema } from '/@/components/Table';

export const primaryKey = 'id';

export const channelOption = [
  { label: '全部', value: '' },
  { label: '小程序渠道', value: '小程序渠道' },
  { label: '礼赠', value: '礼赠' },
  { label: '线下购买', value: '线下购买' },
];

export const statesOption = [...cardStatus];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '购买用户ID',
    dataIndex: 'operatorUser',
    width: 150,
  },
  {
    title: '绑定用户ID',
    dataIndex: 'operatorBindUser',
    width: 150,
  },
  {
    title: '兑换卡名称',
    dataIndex: 'config.name',
    width: 150,
    customRender({ record }: Recordable) {
      return (record.config && record.config.name) || '';
    },
  },
  {
    title: '购卡渠道',
    dataIndex: 'channel',
  },
  {
    title: '兑换卡卡号',
    dataIndex: 'cardNo',
  },
  {
    title: '卡面值',
    dataIndex: 'value',
  },
  {
    title: '卡余额',
    dataIndex: 'balance',
  },
  {
    title: '绑定时间',
    dataIndex: 'boundAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy.MM.dd HH:mm:ss');
    },
  },
  {
    title: '到期时间',
    dataIndex: 'useExpired',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy.MM.dd HH:mm:ss');
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    customRender({ text }) {
      let state = { label: '', value: '', color: '' };
      for (const states of statesOption) {
        states.value === text ? (state = states) : '';
      }
      if (!state?.label) return '-';
      return h(Tag, { color: state.color as GiftCardStates }, () => state?.label);
    },
  },
  {
    title: '备注',
    dataIndex: 'ext',
    key: 'remarkSlot',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '购买用户ID/手机号',
    component: 'Input',
  },
  {
    field: 'bindUserId',
    label: '绑定用户ID/手机号',
    component: 'Input',
  },
  {
    field: 'cardNos',
    label: '卡号',
    component: 'Input',
  },
  {
    field: '[boundAtStart,boundAtEnd]',
    label: '绑定时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'channel',
    label: '购卡渠道',
    component: 'Select',
    componentProps: {
      options: channelOption,
    },
  },
  {
    field: 'states',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: statesOption,
    },
  },
];

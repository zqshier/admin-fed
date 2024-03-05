import { h } from 'vue';
import { Button as Abutton, Tag } from 'ant-design-vue';
import { format } from 'date-fns';
import { GiftCardConsumeType } from '/@/api/app/model/giftCardModel';
import { BasicColumn, FormSchema } from '/@/components/Table';
export const primaryKey = 'id';

export const typeOption = [
  { label: '全部', value: '', color: '' },
  { label: '消费订单', value: GiftCardConsumeType.consume, color: 'green' },
  { label: '退款订单', value: GiftCardConsumeType.refund, color: 'red' },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '用户ID',
    dataIndex: 'operator',
    width: 150,
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
    title: '消费类型',
    dataIndex: 'type',
    customRender({ text }) {
      // let _text = '-';
      // if (!text) return _text;
      // for (const channel of typeOption) {
      //   channel.value === text ? (_text = channel.label) : '';
      // }
      // return _text;
      let typeData = { label: '', value: '', color: '' };
      for (const type of typeOption) {
        type.value === text ? (typeData = type) : '';
      }
      return h(Tag, { color: typeData.color as GiftCardConsumeType }, () => typeData?.label || '-');
    },
  },
  {
    title: '关联订单',
    dataIndex: 'orderNo',
  },
  {
    title: '消费时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return format(new Date(text), 'yyyy.MM.dd HH:mm:ss');
    },
  },
  {
    title: '金额',
    dataIndex: 'amount',
    customRender({ text, record }) {
      const { type } = (record as any) || {};
      if (!text) return '-';
      const amountInfo = { unit: '', color: '' };
      if (type === GiftCardConsumeType.consume) {
        amountInfo.unit = '-';
        amountInfo.color = 'success';
      }
      if (type === GiftCardConsumeType.refund) {
        amountInfo.unit = '+';
        amountInfo.color = 'error';
      }
      return h(
        Abutton,
        {
          type: 'link',
          ghost: true,
          class: `ant-btn-${amountInfo.color}`,
          style: { cursor: 'text' },
        },
        `${amountInfo.unit}${text}`,
      );
    },
  },
  {
    title: '余额',
    dataIndex: 'balance',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  {
    field: 'cardNo',
    label: '卡号',
    component: 'Input',
  },
  {
    field: 'orderNo',
    label: '关联单号',
    component: 'Input',
  },
  {
    field: 'type',
    label: '消费类型',
    component: 'Select',
    componentProps: {
      options: typeOption,
    },
  },
  {
    field: '[startAt,endAt]',
    label: '消费时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
    colProps: {
      span: 10,
    },
  },
];

import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import ScaleImage from '/@/views/components/ScaleImage.vue';
import { formatToDateTime } from '/@/utils/dateUtil';

export const primaryKey = 'id';
export const pageTitle = '评价记录';

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    width: 200,
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    customRender: ({ text }: Recordable) => {
      if (!text) return '';
      return h(OperatorInfo, { type: 'user', id: text, showId: true, block: true });
    },
  },
  {
    title: '商品名称',
    dataIndex: 'goodsInfo',
    customRender: ({ record }: Recordable) => {
      const { image = '', name = '' } = record.goodsInfo;
      if (!image || !name) return '';
      return h('div', { class: 'flex items-center text-left' }, [
        h(ScaleImage, { size: 60, src: image, mode: 'cover', class: 'mr-2' }),
        h('div', name),
      ]);
    },
  },
  {
    title: '评价时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '产品满意度',
    dataIndex: 'productStar',
  },
  {
    title: '产品包装满意度',
    dataIndex: 'productPackagingStar',
  },
  {
    title: '客服满意度',
    dataIndex: 'customerServiceStar',
  },
  {
    title: '物流满意度',
    dataIndex: 'logisticsStar',
  },
  {
    title: '产品推荐度',
    dataIndex: 'recommendationStar',
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'orderNo',
    label: '订单编号',
    component: 'Input',
  },
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
  },
  {
    field: '[start, end]',
    label: '评分时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'goodsName',
    label: '商品名称',
    component: 'Input',
  },
];

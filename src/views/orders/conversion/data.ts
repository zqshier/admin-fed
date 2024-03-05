import {
  EOrderConversionAuditStatus,
  EOrderConversionConfigType,
} from '/@/api/app/model/ordersModel';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { formatToDateTime } from '/@/utils/dateUtil';
import { DescItem } from '/@/components/Description';
import ScaleImage from '/@/views/components/ScaleImage.vue';
import { Tag } from 'ant-design-vue';

export const primaryKey = 'id';
export const pageTitle = '订单转化记录';

export const auditStatusOptions = [
  { label: '全部', value: -1 },
  { label: '待审核', value: EOrderConversionAuditStatus.pending, color: 'gray' },
  { label: '审核通过', value: EOrderConversionAuditStatus.approve, color: 'green' },
  { label: '审核拒绝', value: EOrderConversionAuditStatus.reject, color: 'red' },
];

export const grantStatusOptions = [
  { label: '待发放', value: EOrderConversionAuditStatus.pending, color: 'gray' },
  { label: '发放成功', value: EOrderConversionAuditStatus.approve, color: 'green' },
  { label: '发放失败', value: EOrderConversionAuditStatus.reject, color: 'red' },
];

export enum ERefuseType {
  other = 3,
}

export const refuseTypeOptions = [
  { label: '订单信息不全', value: 1 },
  { label: '订单编号不存在', value: 2 },
  { label: '其他', value: ERefuseType.other },
];

export const channelOptions = [
  { label: '京东-ZIPPO官方自营旗舰店', value: '004' },
  { label: '天猫-zippo官方旗舰店', value: '001' },
  { label: '京东-ZIPPO官方旗舰店', value: '002' },
  { label: '抖音-ZIPPO官方旗舰店', value: '011' },
  { label: '抖音-ZIPPO运动户外旗舰店', value: '019' },
  { label: '得物-Zippo官方品牌账号', value: 'WS-DW' },
  { label: '天猫-其他店铺', value: 'WS-TM' },
  { label: '京东-其他店铺', value: 'WS-JD' },
  { label: '抖音-其他店铺', value: 'WS-DY' },
  { label: '拼多多-其他店铺', value: 'WS-PDD' },
  { label: '小红书-其他店铺', value: 'WS-XHS' },
  { label: '其他-线下经销商等', value: 'WS-Other' },
];

export const columns: BasicColumn[] = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    customRender: ({ text }: Recordable) => {
      if (!text) return '';
      return h(OperatorInfo, { type: 'user', id: text, showType: true, showId: true, block: true });
    },
  },
  {
    title: '会员等级',
    dataIndex: 'levelAlias',
  },
  {
    title: '订单ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    width: 200,
    ellipsis: true,
  },
  {
    title: '订单编号是否重复',
    dataIndex: 'isRepeat',
    customRender: ({ text }: Recordable) => (text ? '是' : '否'),
  },
  {
    title: '订单记录提交时间',
    dataIndex: 'createdAt',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '订单付款时间',
    dataIndex: 'payTime',
    customRender({ text }) {
      if (!text) return '-';
      return formatToDateTime(text);
    },
  },
  {
    title: '平台',
    dataIndex: 'platform',
  },
  {
    title: '渠道',
    dataIndex: 'channelCode',
    customRender: ({ text }) => channelOptions.find((i) => i.value === text)?.label || '',
  },
  {
    title: 'OMS订单编号',
    dataIndex: 'omsOrderNo',
  },
  {
    title: '实付金额',
    dataIndex: 'payAmount',
  },
  {
    title: '会员积分系数',
    dataIndex: 'pointsRate',
  },
  {
    title: '预计发放积分数',
    dataIndex: 'predictIntegral',
  },
  {
    title: '发放积分数',
    dataIndex: 'actualIntegral',
  },
  {
    title: '审核状态',
    dataIndex: 'auditStatus',
    // fixed: 'right',
    customRender: ({ value }: Recordable) => {
      const item = auditStatusOptions.find((i) => i.value === value);
      return h(Tag, { color: item?.color }, () => item?.label || '-');
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'userId',
    label: '用户ID/手机号',
    component: 'Input',
    componentProps: { placeholder: '请输入用户ID/手机号' },
  },
  {
    field: 'orderNo',
    label: '订单编号',
    component: 'Input',
  },
  {
    field: '[startTime, endTime]',
    label: '提交时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'auditStatus',
    label: '审核状态',
    component: 'Select',
    componentProps: { options: auditStatusOptions },
  },
  {
    field: 'platform',
    label: '平台',
    component: 'Input',
  },
  {
    field: 'channelCode',
    label: '渠道',
    component: 'Select',
    componentProps: { options: channelOptions },
  },
];

// 新增/编辑表单配置
export const formSchema: FormSchema[] = [
  {
    field: 'status',
    label: '是否上架',
    component: 'Checkbox',
  },
  {
    field: 'image',
    label: '活动头图',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/png,image/gif',
      maxCount: 1,
    },
  },
  {
    field: 'type',
    label: '转化奖励',
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        {
          label: '按照订单实付金额+会员积分系数赠送积分',
          value: EOrderConversionConfigType.payAmountAndRate,
        },
      ],
    },
  },
  {
    field: 'explainImage',
    label: '转化说明',
    component: 'ImageUploadGroup',
    componentProps: {
      tip: '图片建议尺寸750*750，大小不超过2M，最多9张，可拖拽图片调整显示顺序',
      maxCount: 9,
    },
  },
  {
    field: 'shareImage',
    label: '活动分享图',
    component: 'ImageUpload',
    componentProps: {
      accept: 'image/jpeg,image/png,image/gif',
      maxCount: 1,
    },
  },
];

//详情买家信息
export const userSchema: DescItem[] = [
  {
    field: 'userId',
    label: '用户ID',
    render(record) {
      if (record) {
        return h(OperatorInfo, {
          type: 'user',
          id: record,
          showType: false,
          showId: true,
          block: true,
        });
      }
    },
  },
  {
    field: 'nickname',
    label: '昵称',
  },
  {
    field: 'phone',
    label: '手机号',
  },
  {
    field: 'levelAlias',
    label: '会员等级',
  },
];

// 详情订单信息
export const orderSchema: DescItem[] = [
  {
    field: 'orderNo',
    label: '订单编号',
  },
  {
    field: 'platform',
    label: '平台',
  },
  {
    field: 'channelCode',
    label: '渠道',
    render: (val) => channelOptions.find((i) => i.value === val)?.label || '',
  },
  {
    field: 'productName',
    label: '产品名称',
  },
  {
    field: 'orderAmount',
    label: '订单金额',
  },
  {
    field: 'isRepeat',
    label: '订单编号是否重复',
    render: (val) => (!!val ? '是' : '否'),
  },
  {
    field: 'createdAt',
    label: '提交时间',
    render(val) {
      if (!val) return h('div', '-');
      return h('div', formatToDateTime(val));
    },
  },
  {
    field: 'screenshot',
    label: '订单截图',
    render(val) {
      if (!val?.length) return;
      const imageBox: any = [];
      val.forEach((item) => {
        const data = h(ScaleImage, { size: 60, src: item, mode: 'cover', class: 'mr-2' });
        imageBox.push(data);
      });
      return h('div', { class: 'flex items-center text-left' }, [...imageBox]);
    },
  },
];
// 补充信息
export const replenishSchema: DescItem[] = [
  {
    field: 'omsOrderNo',
    label: 'OMS订单编号',
  },
  {
    field: 'payAmount',
    label: '实付金额',
  },
  {
    field: 'payTime',
    label: '订单付款时间',
    render(val) {
      if (!val) return h('div', '-');
      return h('div', formatToDateTime(val));
    },
  },
  {
    field: 'orderStatus',
    label: '订单状态',
  },
  {
    field: 'shopName',
    label: '店铺名称',
  },
  {
    field: 'receiverName',
    label: '收货人',
    render: (_, data) => `${data?.receiverInfo?.name || data?.receiverName || ''}`,
  },
  {
    field: 'receiverPhone',
    label: '手机号',
    render: (_, data) => `${data?.receiverInfo?.phone || data?.receiverPhone || ''}`,
  },
  {
    field: 'receiverInfo',
    label: '收货省市区',
    render(val) {
      if (!val?.province && !val?.city && !val?.district) return '';
      return `${val.province}${val.city}${val.district}`;
    },
  },
  {
    field: 'receiverAddress',
    label: '收货地址',
    render: (_, data) => `${data?.receiverInfo?.address || data?.receiverAddress || ''}`,
  },
];

export const goodsTableSchema: BasicColumn[] = [
  {
    title: '商品名称',
    dataIndex: 'goodsName',
    customRender: ({ record }: Recordable) => record?.goodsName || '',
  },
  {
    title: '商品条形码',
    dataIndex: 'goodsBarCode',
  },
  {
    title: '商品数量',
    dataIndex: 'num',
  },
  {
    title: '商品实付金额',
    dataIndex: 'amount',
  },
  {
    title: '备注',
    dataIndex: 'notes',
  },
];

export const pointTableSchema: BasicColumn[] = [
  {
    title: '发放积分数',
    dataIndex: 'actualIntegral',
  },
  {
    title: '奖励状态',
    dataIndex: 'grantStatus',
    customRender: ({ value }: Recordable) => {
      const item = grantStatusOptions.find((i) => i.value === value);
      return h(Tag, { color: item?.color }, () => item?.label || '-');
    },
  },
  {
    title: '审核拒绝原因',
    dataIndex: 'refuseReason',
  },
];

// 编辑订单记录配置
export const orderRecordFormSchema: FormSchema[] = [
  {
    required: true,
    field: 'orderNo',
    label: '订单编号',
    component: 'Input',
    componentProps: { maxlength: 50, showCount: true },
  },
  {
    field: 'productName',
    label: '产品名称',
    component: 'Input',
    componentProps: { maxlength: 50, showCount: true },
  },
  {
    field: 'orderAmount',
    label: '订单金额',
    component: 'InputNumber',
    componentProps: { min: 0.01, max: 99999.99, controls: false, precision: 2 },
  },
  {
    field: 'screenshot',
    label: '订单截图',
    component: 'Input',
    slot: 'screenshotSlot',
  },
  {
    field: 'omsOrderNo',
    label: 'OMS订单编号',
    component: 'Input',
    componentProps: { maxlength: 50, showCount: true },
  },
  {
    required: true,
    field: 'payAmount',
    label: '实付金额',
    component: 'InputNumber',
    componentProps: { min: 0.01, max: 99999.99, controls: false, precision: 2 },
  },
  {
    required: true,
    field: 'payTime',
    label: '订单付款时间',
    component: 'DatePickerEx',
    componentProps: {
      disabledDate: (startValue) => {
        if (!startValue) return false;
        return startValue.valueOf() > new Date().getTime();
      },
    },
  },
  {
    required: true,
    field: 'orderStatus',
    label: '订单状态',
    component: 'Input',
    componentProps: { maxlength: 10, showCount: true },
  },
  {
    field: 'shopName',
    label: '店铺名称',
    component: 'Input',
    componentProps: { maxlength: 20, showCount: true },
  },
  {
    field: 'receiverInfo.name',
    label: '收货人',
    component: 'Input',
    componentProps: { maxlength: 10, showCount: true },
  },
  {
    field: 'receiverInfo.phone',
    label: '手机号',
    component: 'Input',
    componentProps: { maxlength: 11, showCount: true },
  },
  {
    field: 'receiverInfo.district',
    label: '收货区',
    component: 'Input',
    ifShow: false,
  },
  {
    field: 'receiverInfo.districtCode',
    label: '收货省市区',
    component: 'Select',
    slot: 'district',
  },
  {
    field: 'receiverInfo.address',
    label: '收货地址',
    component: 'Input',
    componentProps: { maxlength: 50, showCount: true },
  },
  {
    field: 'goodsInfo',
    label: '商品信息',
    component: 'Input',
    slot: 'goodsInfoSlot',
    rules: [
      {
        required: true,
        validator(_, value: Recordable[]) {
          if (value?.length <= 0) return Promise.reject('请填写商品信息');
          for (const v of value) {
            if (!v.goodsName || !v.num || !v.amount) return Promise.reject('请完善商品信息');
          }
          return Promise.resolve();
        },
      },
    ],
  },
];

import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { h } from 'vue';
import ScaleImage from '/@/views/components/ScaleImage.vue';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';
import { DescItem } from '/@/components/Description';
import UserTags from './components/UserTags.vue';
import { Tag } from 'ant-design-vue';
import { wxScenes } from './wx-scene';

export const primaryKey = 'id';
export const pageTitle = '用户列表';

function timeRender({ text, date = false }) {
  if (!text) return '-';
  if (date) return dayjs(text).format('YYYY/MM/DD');
  return dayjs(text).format('YYYY/MM/DD HH:mm:ss');
}

const statusEnumsOptions = [
  { label: '正常', color: 'green', value: 0 },
  { label: '黑名单', color: 'yellow', value: 1 },
  { label: '已注销', color: 'red', value: 2 },
];

//表格列配置
export const columns: BasicColumn[] = [
  {
    title: '用户ID',
    dataIndex: 'id',
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname',
    customRender({ record }: Recordable) {
      return h('div', { class: 'flex items-center' }, [
        h(ScaleImage, {
          size: 30,
          src: record.avatar,
        }),
        h('span', record.nickname),
      ]);
    },
  },
  {
    title: '创建用户时间',
    dataIndex: 'createdAt',
    customRender: timeRender,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    customRender({ text }) {
      return text?.phone;
    },
  },
  {
    title: '成为会员时间',
    dataIndex: 'memberCreatedAt',
    customRender: timeRender,
  },
  {
    title: '积分',
    dataIndex: 'points',
  },
  {
    title: '是否关注公众号',
    dataIndex: 'subscribed',
    customRender({ value }) {
      return value ? '已关注' : '未关注';
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender({ value }) {
      const o = statusEnumsOptions[value];
      return h(Tag, { color: o?.color }, () => o?.label);
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'userIds',
    label: '用户ID',
    component: 'Input',
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
  },
  {
    field: 'sid',
    label: 'SID',
    component: 'Input',
  },
  // {
  //   field: 'subscibe',
  //   label: '是否关注公众号',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '是', value: true },
  //       { label: '否', value: false },
  //     ],
  //   },
  // },
  {
    field: '[registerStart,registerEnd]',
    label: '创建用户时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: '[vipStart,vipEnd]',
    label: '成为会员时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
  {
    field: 'status',
    label: '用户状态',
    component: 'Select',
    componentProps: { options: statusEnumsOptions },
  },
];

// 详情基本信息
export const detailBaseSchema: DescItem[] = [
  {
    field: 'phone',
    label: '手机号',
    render(val) {
      if (!val || !val.phone) return '-';
      return `${val.code} ${val.phone}`;
    },
  },
  {
    field: 'memberCode',
    label: '会员卡号',
  },
  {
    field: 'memberInfo.levelAlias',
    label: '会员等级',
  },
  {
    field: 'points',
    label: '积分',
  },
  {
    field: 'createdAt',
    label: '创建用户时间',
    render(val) {
      return timeRender({ text: val });
    },
  },
  {
    field: 'memberCreatedAt',
    label: '成为会员时间',
    render(val) {
      return timeRender({ text: val });
    },
  },
  {
    field: 'memberFromUserId',
    label: '邀请人',
    render(val) {
      if (val)
        return h(OperatorInfo, {
          id: val,
          type: 'user',
          showType: false,
          showId: true,
          block: true,
        });
      return '';
    },
  },
  {
    field: 'addr_last',
    label: '最近收货地址',
  },
  {
    field: 'subscribed',
    label: '是否关注公众号',
    render(val) {
      return val ? '已关注' : '未关注';
    },
  },
  {
    field: 'subscribedAt',
    label: '关注公众号时间',
    render(val) {
      return timeRender({ text: val });
    },
  },
  {
    field: 'guide.name',
    label: '绑定导购',
  },
  {
    field: 'store.name',
    label: '导购门店',
  },
  {
    field: 'guide.boundAt',
    label: '导购绑定时间',
    render(val) {
      return timeRender({ text: val });
    },
  },
  {
    field: 'addGuide',
    label: '添加导购',
  },
  {
    field: 'openId',
    label: 'openId',
  },
  {
    field: 'unionId',
    label: 'unionId',
  },
  {
    field: 'tags',
    label: '标签',
    render(val, data) {
      return h(UserTags, { tags: val, userId: data.id });
    },
  },
  {
    field: 'status',
    label: '状态',
    render(val) {
      const o = statusEnumsOptions[val];
      return h(Tag, { color: o?.color }, () => o?.label);
    },
  },
  {
    field: 'wxwkContact',
    label: '是否添加企业微信',
    render(val) {
      return val ? '是' : '否';
    },
  },
  {
    field: 'scene',
    label: '来源',
    render(val) {
      return val ? `[${val}]${wxScenes[val] || ''}` : '-';
    },
  },
];

// 详情客户资料
export const detailCustomSchema: DescItem[] = [
  {
    field: 'name',
    label: '姓名',
  },
  {
    field: 'gender',
    label: '性别',
    render(val) {
      return ['女', '男', '保密'][val];
    },
  },
  {
    field: 'province',
    label: '地区',
    render(val, row) {
      return `${val}${row.city}${row.district}`;
    },
  },
  {
    field: 'birthday',
    label: '生日',
    render(val) {
      return timeRender({ text: val, date: true });
    },
  },
];

// 用户交易数据
export const userOrderCustomSchema: DescItem[] = [
  {
    field: 'lastOrderTime',
    label: '最近下单时间',
    render(val) {
      return timeRender({ text: val });
    },
  },
  {
    field: 'totalPaidAmount',
    label: '累计支付金额',
  },
  {
    field: 'totalPaidCount',
    label: '累计支付订单数',
  },
  {
    field: 'avgPaidAmount',
    label: '笔单价',
  },
  {
    field: 'totalRefundAmount',
    label: '累计退款金额',
  },
  {
    field: 'annualPaidAmount',
    label: '年支付金额',
  },
  {
    field: 'totalRefundCount',
    label: '累计退款订单数',
  },
];

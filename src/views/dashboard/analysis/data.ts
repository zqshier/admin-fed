export interface GrowCardItem {
  key: string;
  icon: string;
  title: string;
  value: number;
  total: number;
  totalUnit: string;
  color: string;
  action: string;
  prefix: string;
}

export const growCardList: GrowCardItem[] = [
  {
    key: 'user',
    title: '新用户',
    icon: 'visit-count|svg',
    value: 0,
    total: 0,
    color: 'green',
    action: '今日',
    prefix: '',
    totalUnit: '本月',
  },
  {
    key: 'member',
    title: '会员数',
    icon: 'transaction|svg',
    value: 0,
    total: 0,
    color: 'purple',
    action: '今日',
    prefix: '',
    totalUnit: '本月',
  },
  {
    key: 'order',
    title: '订单数',
    icon: 'total-sales|svg',
    value: 0,
    total: 0,
    color: 'blue',
    action: '今日',
    prefix: '',
    totalUnit: '本月',
  },
  {
    key: 'amount',
    title: '订单金额',
    icon: 'download-count|svg',
    value: 0,
    total: 0,
    color: 'orange',
    action: '今日',
    prefix: '¥',
    totalUnit: '本月',
  },
];

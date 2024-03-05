import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import {
  EFriendPowerConfigCycleRewardStatus,
  EFriendPowerConfigCycleStatus,
} from '/@/api/app/model/friendPowerModel';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { formatToDateTime } from '/@/utils/dateUtil';
import OperatorInfo from '/@/views/components/OperatorInfo.vue';

export const primaryKey = 'id';
export const pageTitle = '助力活动记录';

export function timeRender({ text }) {
  if (!text) return '-';
  return formatToDateTime(text);
}

const activityStatus = [
  { value: EFriendPowerConfigCycleStatus.underway, color: 'blue', label: '进行中' },
  { value: EFriendPowerConfigCycleStatus.complete, color: 'green', label: '已完成' },
  { value: EFriendPowerConfigCycleStatus.failed, color: 'red', label: '助力失败' },
];

const rewardStatus = [
  { value: EFriendPowerConfigCycleRewardStatus.pending, color: 'blue', label: '待发放' },
  { value: EFriendPowerConfigCycleRewardStatus.done, color: 'green', label: '已发放' },
  { value: EFriendPowerConfigCycleRewardStatus.failed, color: 'red', label: '发放失败' },
];

//活动记录表格列配置
export const columns: BasicColumn[] = [
  {
    title: '助力活动名称',
    dataIndex: 'config.name',
    customRender: ({ record }: Recordable) => (record?.config && record.config?.name) || '',
  },
  {
    title: '发起时间',
    dataIndex: 'createdAt',
    customRender: timeRender,
  },
  {
    title: '活动状态',
    dataIndex: 'circleStatus',
    customRender({ record }: Recordable) {
      let value = '';
      // completed为true 已完成
      if (record.completed) value = EFriendPowerConfigCycleStatus.complete;
      if (!record.completed) {
        const nowTime = Date.now();
        /**
         * completed为false
         * 且expireTime大于当前时间 进行中
         * 且expireTime小于当前时间 助力失败
         */
        value =
          new Date(record.expireTime).getTime() > nowTime
            ? EFriendPowerConfigCycleStatus.underway
            : EFriendPowerConfigCycleStatus.failed;
      }

      if (!value) return '';
      const tag = activityStatus.find((i) => i.value === value);
      return h(Tag, { color: tag?.color }, () => tag?.label);
    },
  },
  {
    title: '发起人',
    dataIndex: 'userId',
    customRender({ text }) {
      if (!text) return '';
      return h(OperatorInfo, {
        style: { padding: 0, height: 'auto', lineHeight: 'initial' },
        id: text,
        type: 'user',
        showType: false,
        showId: true,
      });
    },
  },
  {
    title: '发起人来源',
    dataIndex: 'scene',
    customRender({ record }: Recordable) {
      return h(OperatorInfo, {
        style: { padding: 0, height: 'auto', lineHeight: 'initial' },
        id: record.userId,
        type: 'user',
        showType: false,
        showId: false,
        field: 'scene',
      });
    },
  },
  {
    title: '助力人',
    dataIndex: 'friendUserId',
    customRender({ record }: Recordable) {
      if (!record?.records) return '';
      return h('div', { class: 'flex flex-col' }, [
        ...record.records.map((item, index) =>
          h(
            'div',
            {
              class: 'flex-1 p-2',
              style: {
                borderBottom: index === record.records.length - 1 ? 'none' : '1px solid #e5e7eb',
              },
            },
            [
              h(OperatorInfo, {
                style: { padding: 0, height: 'auto', lineHeight: 'initial' },
                id: item.userId,
                type: 'user',
                showType: false,
                showId: true,
              }),
            ],
          ),
        ),
      ]);
    },
  },
  {
    title: '助力来源',
    dataIndex: 'recordsSource',
    customRender({ record }: Recordable) {
      if (!record?.records) return '';
      return h('div', { class: 'flex flex-col' }, [
        ...record.records.map((item, index) => {
          const maxLen = record.records.length - 1;
          return (
            item.scene &&
            h(OperatorInfo, {
              style: { borderBottom: index === maxLen ? 'none' : '1px solid #e5e7eb' },
              id: item.userId,
              type: 'user',
              showType: false,
              showId: false,
              field: 'scene',
            })
            // h(
            //   'div',
            //   {
            //     class: 'flex-1 p-2',
            //     style: { borderBottom: index === maxLen ? 'none' : '1px solid #e5e7eb' },
            //   },
            //   `${item.scene} `,
            // )
          );
        }),
      ]);
    },
  },
  {
    title: '奖品状态',
    dataIndex: 'awardStatus',
    customRender({ record }: Recordable) {
      if (!record?.rewards) return '';
      // 判断rewards数组是否存在发起人id，再判断processed枚举
      const data = record.rewards.filter((item) => item.userId === record.userId);
      if (!data?.length) return '';
      const [item, _] = data;
      const tag = rewardStatus.find((i) => i.value === item.processed);
      return h(Tag, { color: tag?.color }, () => tag?.label);
    },
  },
];

//搜索表单配置
export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '助力活动名称',
    component: 'Input',
  },
  {
    field: 'initiatorUserId',
    label: '发起人身份',
    component: 'Input',
    componentProps: { placeholder: '请输入用户id或手机号' },
  },
  {
    field: 'circleStatus',
    label: '活动状态',
    component: 'Select',
    componentProps: { options: activityStatus },
  },
  {
    field: 'friendUserId',
    label: '助力人身份',
    component: 'Input',
    componentProps: { placeholder: '请输入用户id或手机号' },
  },
  {
    field: 'rewardStatus',
    label: '奖品状态',
    component: 'Select',
    componentProps: { options: rewardStatus },
  },
  {
    field: '[startAt, endAt]',
    label: '发起时间',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD HH:mm:ss',
      placeholder: ['开始时间', '结束时间'],
      showTime: { format: 'HH:mm:ss' },
    },
  },
];
